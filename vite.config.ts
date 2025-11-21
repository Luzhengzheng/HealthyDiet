import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        electron({
            main: {
                entry: 'src/main/main.ts',
            },
            preload: {
                input: path.join(__dirname, 'src/main/preload.ts'),
            },
            renderer: process.env.NODE_ENV === 'test' ? undefined : {},
        }),
    ],
});
