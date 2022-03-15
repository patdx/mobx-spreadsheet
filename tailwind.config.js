module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
  // plugins: [require("daisyui")],
  // daisyui: {
  //   // styled: true,
  //   // themes: true,
  //   // base: true,
  //   // utils: true,
  //   // logs: true,
  //   // rtl: false,
  //   // prefix: "",
  //   darkTheme: "light",
  // },
};
