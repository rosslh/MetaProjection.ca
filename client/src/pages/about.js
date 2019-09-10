import React from "react";

import Layout from "../layouts/index";
import SEO from "../components/seo";
import { css } from "@emotion/core";

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
    <p>About...</p>
  </Layout>
);

export default About;
