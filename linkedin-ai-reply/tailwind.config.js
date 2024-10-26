/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",      // Includes all JavaScript and TypeScript files in the src folder
      "./entrypoints/**/*.{ts,tsx}",     // Includes all TypeScript files in the entrypoints folder
      "./public/index.html",              // Includes the HTML files in the public folder
    ],
    plugins: [],
  };
  