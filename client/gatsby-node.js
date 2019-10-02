const path = require("path");
const slugify = require("slugify");
const data = require("./src/data/districts.json");

exports.createPages = ({ boundActionCreators, actions }) => {
  const { createPage } = boundActionCreators;
  const { createRedirect } = actions;
  // Your component that should be rendered for every item in JSON.
  const template = path.resolve(`src/templates/district.js`);

  // Create pages for each JSON entry.
  data.forEach(({ number, name }) => {
    const path = `/riding/${slugify(name)}`;
    const redirectPath0 = `/riding/${number}`;
    const redirectPath1 = `/district/${number}`;

    createPage({
      path,
      component: template,

      // Send additional data to page from JSON (or query inside template)
      context: {
        path,
        number,
        name,
      },
    });

    createRedirect({
      fromPath: redirectPath0,
      toPath: path,
      isPermanent: true,
      redirectInBrowser: true,
    });

    createRedirect({
      fromPath: redirectPath1,
      toPath: path,
      isPermanent: true,
      redirectInBrowser: true,
    });
  });
};
