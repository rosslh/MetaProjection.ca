# MetaProjection.ca

[MetaProjection.ca](https://www.metaprojection.ca/) is a web application designed to provide Canadian voters with up-to-date electoral projections. By aggregating data from multiple trusted sources, it offers a clear and comprehensive overview of how the election is shaping up, both at the federal level and within individual electoral districts.

![Netlify](https://img.shields.io/netlify/3dd4e416-74a7-49b1-847a-ad95a0b44607?style=flat-square&label=Netlify)
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m792388124-b7e4417815ddd9388914883d?up_message=online&style=flat-square&label=Status)
![Uptime Robot ratio (30 days)](<https://img.shields.io/uptimerobot/ratio/m792388124-b7e4417815ddd9388914883d?style=flat-square&label=Uptime%20(1mo)>)

## Features

### Interactive Electoral Map

The centerpiece of the application is an interactive map displayed prominently at the top of the page. This map provides a visual representation of how each electoral district across Canada is likely to vote. The color-coded districts allow users to quickly grasp the projected political landscape at a glance.

### Personalized District Information

MetaProjection.ca takes user experience a step further by utilizing geolocation technology. Upon granting permission, the application can identify the user's current electoral district and highlight it on the map. This feature allows voters to immediately see the projected outcome for their local area, fostering a more engaged and informed electorate.

### Comprehensive Data Aggregation

By compiling projections from various reputable sources, MetaProjection.ca offers a balanced and nuanced view of the electoral landscape. This approach helps mitigate potential biases and provides users with a more accurate overall picture of the upcoming election.

## How It Works

1. Visit [MetaProjection.ca](https://www.metaprojection.ca/)
2. Allow geolocation access for personalized district information (optional)
3. Explore the interactive map to view projections for different regions
4. Dive deeper into specific districts or overall federal projections as needed

MetaProjection.ca aims to be an essential tool for Canadian voters, political analysts, and anyone interested in staying informed about the country's electoral dynamics.

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
