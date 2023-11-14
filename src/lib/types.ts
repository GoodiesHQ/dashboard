import type { ExtendedIconifyIcon } from '@iconify/types';

export interface Application {
	name: string;
	url: string;
	url_display?: string;
	icon: string;
	icon_data?: ExtendedIconifyIcon | string;
	tab?: boolean;
	category?: string;
}

export interface Bookmark {
	name: string;
	url: string;
	new_tab: boolean;
	category?: string;
}

export type Applications = Application[];
export type CategorizedApplications = { [category: string]: Applications };
export type Bookmarks = Bookmark[];
export type CategorizedBookmark = { [category: string]: Bookmarks };

export interface Config {
	title?: string;
	apps: Applications;
	bookmarks: Bookmarks;
	datetime?: string;
	description?: string;
}
