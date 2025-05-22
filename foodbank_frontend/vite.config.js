// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react() , tailwindcss()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: { // Inline Tailwind config
        darkMode: 'class',
        content: [
          "./index.html",
          "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
          extend: {
            colors: {
              light: {
                primary: '#f3f4f6',
                text: '#1f2937'
              },
              dark: {
                primary: '#1f2937',
                text: '#f3f4f6'
              }
            }
          }
        }
      }
    })
  ]
})