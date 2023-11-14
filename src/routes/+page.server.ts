import yaml from 'js-yaml';
import { building } from '$app/environment';
import { type Cache, CacheLocal } from '$lib/cache';
import type { Config } from '$lib/types';
import { getIconData } from '@iconify/utils';
// import { DASHBOARD_CONFIG } from '$env/static/private';
import { resolve } from 'path';
import { readFile } from 'node:fs/promises';
import type { IconifyJSON } from '@iconify/types';
import { isUrl } from '$lib/utils';

const DEFAULT_DASHBOARD_CONFIG = '/config/dashboard.yml';
const DASHBOARD_CONFIG = process.env.DASHBOARD_CONFIG || DEFAULT_DASHBOARD_CONFIG;

const DEFAULT_ICON_FAMILY = 'mdi';

// each icon family JSON data in an object
type IconData = {
	[family: string]: IconifyJSON;
};

// parse an icon name (e.g. "mdi:alarm") and separate out the API, family, and name
type IconInfo = {
	api?: string;
	family?: string;
	name?: string;
	url?: string;
};

// convert the IconInfo into a string using [<api>:]<family>:<name> format
function stringIconInfo(ii: IconInfo): string {
	if (ii.url != undefined) {
		return ii.url;
	}

	let s = '';
	if (ii.api !== undefined) {
		s += ii.api + ':';
	}

	s += ii.family + ':';
	s += ii.name;

	return s;
}

// parse the API, family, and icon name
function parseIconName(icon: string): IconInfo {
	if (isUrl(icon)) {
		return {
			url: icon,
		};
	}

	const iconInfo = icon.toLowerCase().split(':');

	if (iconInfo.length == 3) {
		return {
			api: iconInfo[0],
			family: iconInfo[1],
			name: iconInfo[2],
		};
	}

	if (iconInfo.length == 2) {
		return {
			family: iconInfo[0],
			name: iconInfo[1],
		};
	}

	if (iconInfo.length == 1) {
		return {
			family: DEFAULT_ICON_FAMILY,
			name: iconInfo[0],
		};
	}
	throw new Error('Invalid Icon Name');
}

async function loadIconFamilies(strIconFamilies: string[]) {
	// load provided icons
	const allIconData = {} as IconData;
	await Promise.all(
		strIconFamilies.map(async (strIconFamily) => {
			try {
				// import the locate function for resolving JSON files if the package exists
				const pkg = '@iconify/json';
				const locate = (await import(/* @vite-ignore */ pkg)).locate;

				// parse JSON data of the icon family
				const iconJson = JSON.parse(
					await readFile(resolve(locate(strIconFamily).toString()), 'utf-8'),
				);

				// set the icon JSON data to the
				allIconData[strIconFamily] = iconJson;
				console.log(`Loaded icon family '${strIconFamily}'.`);
			} catch (e) {
				if (!building) {
					console.log(
						`Failed loading icon family '${strIconFamily}'. Falling back to public API: ${e}`,
					);
				}
			}
		}),
	);
	return allIconData;
}

async function populateIcons(config: Config) {
	// attempt to load all icon families
	const strIconFamilies: string[] = [];
	config.apps.map((app) => {
		try {
			const strIconFamily = parseIconName(app.icon).family;
			// keep each required icon family exactly once
			if (strIconFamily && !strIconFamilies.includes(strIconFamily)) {
				strIconFamilies.push(strIconFamily);
			}
		} catch (exception) {
			console.log(`Invalid icon name '${app.icon}'`);
		}
	});

	// attempt to load the icon families
	const allIconFamilies =
		strIconFamilies.length > 0 ? await loadIconFamilies(strIconFamilies) : ({} as IconData);

	config.apps.map((app, i) => {
		try {
			// parse icon family and icon name and set app.icon value to the same (provide a default family)
			const iconInfo = parseIconName(app.icon);
			config.apps[i].icon = stringIconInfo(iconInfo);

			// if icon SVG or URL data is provided, don't bother using an API
			if (app.icon_data) {
				console.log('Icon Data Provided');
				return;
			}

			if (iconInfo.api !== undefined) {
				// ignore, use explicit API provided
				return;
			}

			if (iconInfo.url !== undefined) {
				console.log(`Using URL '${app.icon}'`);
				return;
			}

			// check if icon data exists
			if (iconInfo.family && iconInfo.name) {
				const iconData = getIconData(
					allIconFamilies[iconInfo.family] as IconifyJSON,
					iconInfo.name,
				);
				if (iconData != null) {
					console.log(`Setting Icon Data for '${app.icon}'`);
					app.icon_data = iconData;
				} else {
					console.log('No data', iconInfo.family, iconInfo.name);
				}
			}
		} catch (_) {
			// do nothing
		}
	});
}

const configCache: Cache<Config> = new CacheLocal<Config>(async () => {
	// load and parse the configuration file for the dashboard display
	try {
		const config: Config = yaml.load(await readFile(resolve(DASHBOARD_CONFIG), 'utf-8')) as Config;
		console.log(`Loaded configuration from '${DASHBOARD_CONFIG}'...`);

		try {
			await populateIcons(config);
		} catch (e) {
			//console.log(e);
		}

		return config;
	} catch (e) {
		configCache.set(null);
		console.log('Error Loading Config:');
		console.log(e);
		return {
			apps: [],
			bookmarks: [],
		};
	}
});

// load should grab the cached config and rebuild the cache if needed
export const load = async (): Promise<Config> => {
	try {
		const config = await configCache.get();
		if (config == null) {
			throw new Error('Unable to load configuration. Setting to null.');
		}
		return config;
	} catch (exception) {
		configCache.set(null);
		console.log(exception);
	}
	return { apps: [], bookmarks: [] };
};
