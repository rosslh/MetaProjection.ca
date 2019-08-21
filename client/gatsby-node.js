const path = require("path")
const data = require("./src/data/districts.json")

exports.createPages = ({ boundActionCreators }) => {
  const { createPage } = boundActionCreators

  // Your component that should be rendered for every item in JSON.
  const template = path.resolve(`src/templates/district.js`)

  // Create pages for each JSON entry.
  data.forEach(({ number }) => {
    const path = `district/${number}`

    createPage({
      path,
      component: template,

      // Send additional data to page from JSON (or query inside template)
      context: {
        path,
      },
    })
  })
}
