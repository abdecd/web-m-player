import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': 'http://music.163.com',
            '/discover': 'https://music.163.com'
        }
    }
})
