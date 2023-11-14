export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.ecbd4350.js","app":"_app/immutable/entry/app.e493d4a1.js","imports":["_app/immutable/entry/start.ecbd4350.js","_app/immutable/chunks/scheduler.61a9aa11.js","_app/immutable/chunks/singletons.30538e23.js","_app/immutable/entry/app.e493d4a1.js","_app/immutable/chunks/scheduler.61a9aa11.js","_app/immutable/chunks/index.29b432b1.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
