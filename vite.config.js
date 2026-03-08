import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  // یہ لائن ویٹ کو مجبور کرتی ہے کہ وہ موجودہ فولڈر میں فائل ڈھونڈے
  root: process.cwd(), 
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
