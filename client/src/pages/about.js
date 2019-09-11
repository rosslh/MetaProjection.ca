import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { css } from "@emotion/core";
import { projections } from "../utils/utils";

const About = () => (
  <Layout noMap>
    <SEO title="Home" />
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
      how the election is playing out.
    </p>
    <h3>Sources</h3>
    <ul>
      {Object.keys(projections)
        .sort()
        .map(key => {
          const projection = projections[key];
          return (
            <li key={key}>
              <a href={projection.url}>{projection.name}</a>
            </li>
          );
        })}
    </ul>
  </Layout>
);

export default About;
