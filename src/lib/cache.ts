// simple, naive cache implementation
import { DEFAULT_CACHE_TTL as DEFAULT_CACHE_TTL_STR } from '$env/static/private';

const DEFAULT_CACHE_TTL = parseInt(DEFAULT_CACHE_TTL_STR);

export interface Cache<T> {
	isValid(): boolean;
	set(value: T | null): void;
	get(): Promise<T>;
}

export class CacheLocal<T> implements Cache<T> {
	private value: T | null;
	private ttl: number;
	private expires: number;
	private building: Promise<T> | null;
	private builder: () => Promise<T>;

	constructor(builder: () => Promise<T>, ttl: number = DEFAULT_CACHE_TTL) {
		this.ttl = ttl;
		this.expires = Date.now() + ttl;
		this.value = null;
		this.building = null;
		this.builder = builder;
		this.build();
	}

	isValid(): boolean {
		return Date.now() < this.expires;
	}

	set(value: T | null) {
		this.expires = Date.now() + this.ttl;
		this.value = value;
	}

	async get(): Promise<T> {
		if (!this.value || !this.isValid()) {
			console.log('Cache Miss');
			return await this.build();
		}
		console.log('Cache Hit');
		return this.value;
	}

	private async build(): Promise<T> {
		if (this.building) {
			await this.building;
		} else {
			this.building = this.builder();
			try {
				const value = await this.building;
				this.value = value;
			} catch (e) {
				console.log('error in build');
				this.value = null;
			}
			this.building = null;
		}
		if (this.value == null) {
			throw new Error('Failed to buid cache.');
		}
		return this.value;
	}
}
