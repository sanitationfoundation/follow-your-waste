const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---src-pages-404-js": hot(preferDefault(require("/Users/coreytegeler/Sites/follow-your-waste-gatsby/src/pages/404.js"))),
  "component---src-templates-app-js": hot(preferDefault(require("/Users/coreytegeler/Sites/follow-your-waste-gatsby/src/templates/app.js")))
}

