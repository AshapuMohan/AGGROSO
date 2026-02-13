// Tailwind v4 does not need this file by default if using CSS variables for configuration.
// However, we can keep it for legacy support or specific plugin configs if needed.
// For now, I'm emptying it as we moved config to index.css @theme
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
