import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    define: {
      'process.env.REACT_APP_GOOGLE_MAPS_CLIENT_ID': JSON.stringify(
        env.VITE_REACT_APP_GOOGLE_MAPS_CLIENT_ID
      ),
    },
    resolve: {
      alias: {
        '@vis.gl/react-google-maps/examples.js':
          'https://visgl.github.io/react-google-maps/scripts/examples.js',
      },
    },
  };
});
