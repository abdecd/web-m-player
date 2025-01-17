import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(),viteSingleFile()],
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': 'http://music.163.com',
            '/discover': 'https://music.163.com'
        }
    },
    build: {
        target: "es2018",// chrome63
        chunkSizeWarningLimit: "1000"
    }
})