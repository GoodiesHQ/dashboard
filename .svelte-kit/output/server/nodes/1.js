

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.0e54ba7d.js","_app/immutable/chunks/scheduler.61a9aa11.js","_app/immutable/chunks/index.29b432b1.js","_app/immutable/chunks/singletons.30538e23.js"];
export const stylesheets = [];
export const fonts = [];
