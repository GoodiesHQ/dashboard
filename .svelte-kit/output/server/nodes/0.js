import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.c9324a77.js","_app/immutable/chunks/scheduler.61a9aa11.js","_app/immutable/chunks/index.29b432b1.js"];
export const stylesheets = ["_app/immutable/assets/0.d240a023.css"];
export const fonts = [];
