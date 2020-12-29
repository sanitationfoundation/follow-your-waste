// prefer default export if available
const preferDefault = m => (m && m.default) || m

exports.components = {
  "component---src-pages-404-js": () => import("./../../../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */),
  "component---src-templates-app-js": () => import("./../../../src/templates/app.js" /* webpackChunkName: "component---src-templates-app-js" */)
}

