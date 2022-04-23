import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { socketServer } from './websocket-server.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},

    vite: {
      plugins: [
        socketServer()
      ]
    }
	}
};

export default config;
