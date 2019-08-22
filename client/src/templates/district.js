import React from "react";
import { StaticQuery, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";

const District = data => (
  <StaticQuery
    query={graphql`
      query ByDistrict2019Query {
        byDistrictJson {
          districts {
            _10001 {
              calculatedPolitics {
                confidence
                party
              }
              threethirtyeight {
                confidence
                party
              }
            }
          }
        }
      }
    `}
    render={({ byDistrictJson }) => (
      <Layout>
        <SEO title="District" />
        <div>← Back to federal projection</div>
        <h2>{data.pageContext.name}</h2>
        <h3>Likely winner</h3>
        <div>...</div>
        <h3>Sources</h3>
        <div>{JSON.stringify(byDistrictJson, null, 2)}</div>
      </Layout>
    )}
  />
);

export default District;
