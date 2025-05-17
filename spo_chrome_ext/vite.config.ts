import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
// import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),crx({ manifest })],
  legacy: {
    skipWebSocketTokenCheck: true
  },
  server: {
    cors: {
      origin: [
        'chrome-extension://',  // Allow all extensions in dev
        // Or for production, specific extension IDs:
        // 'chrome-extension://<your-extension-id>'
      ]
    }
  }
})
