exports.createPages = async ({ actions: { createPage } }) => {
  const langs = ["en", "es", "zh"];

  createPage({
    path: `/`,
    component: require.resolve("./src/templates/app.js"),
    context: {
      lang: "en",
    },
  });
  langs.forEach((lang) => {
    createPage({
      path: `/${lang}/`,
      component: require.resolve("./src/templates/app.js"),
      context: {
        lang: lang,
      },
    });
  });
};
