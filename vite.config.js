import { resolve } from 'path'
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/subsrt.js'),
      name: 'subsrt',
      fileName: 'subsrt',
      formats: ['es', 'cjs', 'umd']
    }
  },
  test: {
    coverage: {
      provider: 'v8'
    }
  }
})
