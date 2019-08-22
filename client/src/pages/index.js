import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { StaticQuery, graphql } from "gatsby";
import { css } from "@emotion/core";

const IndexPage = () => (
  <StaticQuery
    query={graphql`
      query Federal2019Query {
        federalJson {
          parties {
            avg
            name
            projections {
              calculatedPolitics
              cdnElectionWatch
              threethirtyeight
              cbc
            }
          }
        }
      }
    `}
    render={({ federalJson }) => (
      <Layout>
        <SEO title="Home" />
        <h2>Federal election projection</h2>
        <p>Aggregated from ...</p>
        {federalJson.parties // TODO: output sorted and with pretty names
          .map(party => (
            <div
              css={css`
                display: flex;
                width: 100%;
                justify-content: space-between;
                margin: 0.2rem 0;
                padding: 0.2rem;
                border: 1px solid #ccc;
              `}
            >
              <div>Image here</div>
              <div>{party.name}</div>
              <div>{party.avg}</div>
              <div>i</div>
            </div>
          ))}
      </Layout>
    )}
  />
);

export default IndexPage;
