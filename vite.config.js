import {
  defineConfig,
  loadEnv
} from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  join,
  resolve
} from 'path'

// const remote = 'http://10.7.0.15:52577/'

// https://vitejs.dev/config/
export default defineConfig((mode, command) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return {
    base: env.VITE_APP_BASE,
    plugins: [vue()],
    server: {
      port: 10082,
      proxy: {
        // '/api': {
        //   target: remote,
        //   ws: true,
        //   pathRewrite: {
        //     // '^/api': '/'
        //   }
        // },
        // '/file/': {
        //   target: 'http://10.7.0.15:46786/',
        // },
      }
    },
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm-browser.js',
        "@": join(__dirname, 'src'),
        "@style": join(__dirname, 'src/assets/style'),
        "@image": join(__dirname, 'src/assets/image'),
        "@js": join(__dirname, 'src/assets/js'),
        "@public": join(__dirname, 'public'),
        "@api": join(__dirname, 'src/api'),
        "@components": join(__dirname, 'src/components'),
      }

    },
  }
})