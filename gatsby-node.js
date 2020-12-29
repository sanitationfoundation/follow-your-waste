exports.createPages = async ({ actions: { createPage } }) => {
  // `getPokemonData` is a function that fetches our data
  const langs = ["en", "es", "zh"];
  // Create a page that lists all Pokémon.
  // createPage({
  //   path: `/`,
  //   component: require.resolve("./src/templates/all-pokemon.js"),
  //   context: { allPokemon },
  // })
  // Create a page for each Pokémon.
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
