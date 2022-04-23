import adapter from '@sveltejs/adapter-node';
import { Server } from 'socket.io';
import preprocess from 'svelte-preprocess';

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
        {
          name: "websocket-svelte",
          configureServer(server) {
            import("./dist/websocket.js").then(({ default: websocket }) => {
              websocket(new Server(server.httpServer));
            });
          }
        }
      ]
    }
	}
};

export default config;
