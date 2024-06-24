# MetaProjection

[![Netlify Status](https://api.netlify.com/api/v1/badges/3dd4e416-74a7-49b1-847a-ad95a0b44607/deploy-status)](https://app.netlify.com/sites/metaprojection/deploys)
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m792388124-b7e4417815ddd9388914883d)

MetaProjection is a web application that aggregates Canadian electoral projections from multiple sources and provides an overview of how the election is playing out, both federally and by district.

A map is displayed at the top of the page which indicates how each electoral district is likely to vote. The application uses the user’s geolocation to find their district and display its likely winner.

## Technologies used

- **Framework**: [React](https://reactjs.org/) / [Gatsby](https://www.gatsbyjs.org/)
- **CSS-in-JS**: [Emotion](https://emotion.sh/docs/introduction)
- **Mapping**: [Leaflet](https://leafletjs.com/) / [OpenStreetMap](https://www.openstreetmap.org)
- **State management**: [MobX](https://github.com/mobxjs/mobx)
- **Scraping**: [Puppeteer](https://github.com/GoogleChrome/puppeteer)
- **Integration testing**: [Cypress](https://www.cypress.io/)
- **Error tracking**: [Sentry](https://sentry.io/welcome/)
- **Hosting**: [Netlify](https://www.netlify.com/)
- **Continuous integration**: [GitHub Actions](https://github.com/features/actions)
