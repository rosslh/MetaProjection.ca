import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { css } from "@emotion/core";
import { projections } from "../utils/utils";

const About = () => (
  <Layout noMap>
    <SEO title="About" />
    <h2
      css={css`
        margin-bottom: 1rem;
      `}
    >
      About
    </h2>
    <p>
      This website aggregates and synthesises the latest Canadian federal
      election projections from multiple sources in order to give an overview of
      how the election is playing out, both federally and by district.
    </p>
    <p>
      A map is displayed at the top of the page which indicates how each
      electoral district is likely to vote. The application uses the user’s
      geolocation to find their district and display its likely winner.
    </p>
    <h3>Sources</h3>
    <ul>
      {Object.keys(projections)
        .sort()
        .map(key => {
          const projection = projections[key];
          return (
            <li key={key}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={projection.url}
              >
                {projection.name}
              </a>
            </li>
          );
        })}
    </ul>
  </Layout>
);

export default About;
