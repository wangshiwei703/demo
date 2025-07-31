import {
  defineConfig
} from "vite";
import vue from "@vitejs/plugin-vue";
import {
  join
} from 'path'
// import {visualizer} from 'rollup-plugin-visualizer'
export default defineConfig({
  build: {
    target: "modules",
    //打包后文件目录
    outDir: "es",
    //压缩
    minify: 'esbuild',
    assetsInlineLimit: 0,
    reportCompressedSize: false,
    sourcemap: false,
    commonjsOptions: {
      esmExternals: true 
    },
    rollupOptions: {
      //忽略打包vue文件
      external: ["vue"],
      //input: ["index.ts"],
      output: {
        globals: {
          vue: "Vue",
          // "echarts": "echarts"
        },
        dir: "dist",
        // manualChunks: undefined,
        // chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        // entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        // assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
      },
    },
    lib: {
      entry: "./src/library.js",
      name: "viteVue3Template",
      fileName: (format) => `viteVue3Template.${format}.js`,
      formats: ["umd"],
    },
  },
  plugins: [vue()], //, visualizer({open: true})
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
});