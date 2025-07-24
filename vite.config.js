import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite';





// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwind(),

  ],

  build: {
    chunkSizeWarningLimit: 1000, // bump the warning limit if you want
    rollupOptions: {
      output: {
        manualChunks: {
          // everything in node_modules/react* goes into "react-vendor.js"
          'react-vendor': ['react', 'react-dom'],
          // firebase and related libs
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          // your big UI libs
          'ui-vendor': ['@hello-pangea/dnd', '@headlessui/react', 'lucide-react'],
        }
      }
    }
  }
});
