import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { svgSpritemap } from 'vite-plugin-svg-spritemap'
export default defineConfig({
  plugins: [
    vue(),
    // svg icon
    svgSpritemap({
      pattern: 'src/icons/*.svg', // 需要处理的svg路径
      filename: 'static/spritemap.svg', // 生成的精灵图路径
      svgo: false,
      currentColor: false
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          resolveIcons: true,
          cjs: false,
          importStyle: false
        })
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  }
})
