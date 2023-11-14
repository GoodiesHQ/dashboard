export function titleCase(str: string): string {
	const strTitle = str.toLowerCase().replaceAll('-', ' ').replaceAll('_', ' ').split(' ');
	for (let i = 0; i < strTitle.length; i++) {
		strTitle[i] = strTitle[i].charAt(0).toUpperCase() + strTitle[i].slice(1);
	}
	return strTitle.join(' ');
}

interface ToString {
	toString(): string;
}

export function zpad<T extends ToString>(value: T, n: number = 2) {
	return ('0'.repeat(n) + value.toString()).slice(-n);
}

export function isUrl(data?: string): boolean {
	if (data === undefined) {
		return false;
	}
	try {
		new URL(data);
		return data.startsWith('http://') || data.startsWith('https://');
	} catch (e) {
		return false;
	}
}

export function getHost(url?: string) {
	if (url === undefined) {
		return '';
	}
	return new URL(url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`)
		.hostname;
}

export function formatTime(format?: string, date?: Date): string {
	if (format == undefined) {
		return '';
	}

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	if (date === undefined) {
		date = new Date();
	}

	const y = date.getFullYear();
	const m = date.getMonth();
	const d = date.getDate();
	const a = date.getDay();

	const H = date.getHours();
	const HS = H > 12 ? 'PM' : 'AM'; // Hour Suffix
	const H2 = H == 0 ? 12 : H % 12; // Hour mod 12
	const M = date.getMinutes();
	const S = date.getSeconds();

	// year
	format = format.replaceAll('%Y', y.toString());
	format = format.replaceAll('%y', (y % 100).toString());

	// month
	format = format.replaceAll('%b', months[m].slice(0, 3));
	format = format.replaceAll('%B', months[m]);
	format = format.replaceAll('%m', zpad(m + 1));
	format = format.replaceAll('%-m', (m + 1).toString());

	// date
	format = format.replaceAll('%d', zpad(d));
	format = format.replaceAll('%-d', d.toString());

	// day
	format = format.replaceAll('%a', days[a].slice(0, 3));
	format = format.replaceAll('%A', days[a]);

	// hour
	format = format.replaceAll('%H', zpad(H));
	format = format.replaceAll('%-H', H.toString());
	format = format.replaceAll('%I', zpad(H2));
	format = format.replaceAll('%-I', H2.toString());
	format = format.replaceAll('%p', HS);

	// minute
	format = format.replaceAll('%M', zpad(M));
	format = format.replaceAll('%-M', M.toString());

	// second
	format = format.replaceAll('%S', zpad(S));
	format = format.replaceAll('%-S', S.toString());

	return format;
}

export interface Category {
	category?: string;
}

export type Categorized<T> = {
	[category: string]: T[];
};

export const DEFAULT_CATEGORY = 'uncategorized';

export function categorize<T extends Category>(
	values: T[],
	defaultCategory: string = DEFAULT_CATEGORY,
): Categorized<T> {
	return values.reduce((catVals: Categorized<T>, val: T) => {
		const category: string = val.category || defaultCategory;
		if (catVals[category] === undefined) {
			catVals[category] = [] as T[];
		}
		catVals[category].push(val);
		return catVals;
	}, {} as Categorized<T>);
}

export function categories<T>(categorized: Categorized<T>): string[] {
	let keys = Object.keys(categorized);
	if (keys.includes(DEFAULT_CATEGORY)) {
		keys = [...keys.filter((k) => k !== DEFAULT_CATEGORY), DEFAULT_CATEGORY];
	}
	return keys;
}
