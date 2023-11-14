import { DASHBOARD_CACHE_TTL as DASHBOARD_CACHE_TTL_STR } from '$env/static/private';

const DASHBOARD_CACHE_TTL = parseInt(DASHBOARD_CACHE_TTL_STR);

export interface Cache<T> {
	isValid(): boolean;
	set(value: T | null): void;
	get(): Promise<T | null>;
}

export class CacheLocal<T> implements Cache<T> {
	private value: T | null;
	private ttl: number;
	private expires: number;
	private building: Promise<T> | null;
	private builder: () => Promise<T>;

	constructor(builder: () => Promise<T>, ttl: number = DASHBOARD_CACHE_TTL) {
		this.ttl = ttl;
		this.expires = 0;
		this.value = null;
		this.building = null;
		this.builder = builder;
	}

	isValid(): boolean {
		return Date.now() < this.expires;
	}

	set(value: T | null) {
		this.expires = value == null ? 0 : Date.now() + this.ttl;
		this.value = value;
	}

	async get(): Promise<T | null> {
		if (!this.value || !this.isValid()) {
			// console.log('Cache Miss');
			try {
				return await this.build();
			} catch (e) {
				console.log(e);
				this.set(null);
			}
		}
		// console.log('Cache Hit');
		return this.value;
	}

	private async build(): Promise<T> {
		if (this.building) {
			await this.building;
		} else {
			this.building = this.builder();
			try {
				const value = await this.building;
				this.set(value);
			} catch (e) {
				console.log('Error in cache build function:', e);
			}
			this.building = null;
		}
		if (this.value == null) {
			throw new Error('Failed to build cache.');
		}
		return this.value;
	}
}
