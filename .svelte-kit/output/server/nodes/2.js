import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.4a97e96f.js","_app/immutable/chunks/scheduler.61a9aa11.js","_app/immutable/chunks/index.29b432b1.js","_app/immutable/chunks/singletons.30538e23.js"];
export const stylesheets = ["_app/immutable/assets/2.412507a0.css"];
export const fonts = [];
