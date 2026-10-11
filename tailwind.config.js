/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F6F8FB',
          card: '#FFFFFF',
          text: '#17263C',
          muted: '#64748B',
          sidebar: '#122238',
          sidebarHover: '#1B3150',
          sidebarActive: '#223E63',
          teal: '#0F766E',
          tealHover: '#115E59',
          tealLight: '#F0FDFA',
          border: '#E2E8F0',
          warningBg: '#FFF7ED',
          warningBorder: '#FED7AA',
          warningText: '#C2410C',
          errorBg: '#FEF2F2',
          errorBorder: '#FCA5A5',
          errorText: '#B91C1C',
          successBg: '#ECFDF5',
          successBorder: '#6EE7B7',
          successText: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
