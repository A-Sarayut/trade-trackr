// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  ssr: false,
  app: {
    baseURL: process.env.NODE_ENV === "production" ? "/trade-trackr/" : "/",
  },
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"], // import global CSS styles from nuxt ui
  ui: {
    // fonts: false,
    // colorMode: false
  },
  // runtimeConfig: {
  //   // The private keys which are only available server-side
  //   apiSecret: "123",
  //   // Keys within public are also exposed client-side
  //   public: {
  //     apiBase: "/api",
  //   },
  // },
});
