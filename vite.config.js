import {
  defineConfig,
  loadEnv
} from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  join
} from 'path'

// https://vitejs.dev/config/
export default defineConfig((mode, command) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return {
    base: env.VITE_APP_BASE,
    plugins: [vue()],
    resolve: {
      alias: {
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