import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";

const getWinner = data =>
  data.byDistrictJson.scores.reduce((prev, current) => {
    return prev.score > current.score ? prev : current;
  });

const District = ({ data, pageContext }) => (
  <Layout>
    <SEO title="District" />
    <div>← Back to federal projection</div>
    <h2>{pageContext.name}</h2>
    <h3>Likely winner</h3>
    <div>{JSON.stringify(getWinner(data))}</div>
    <h3>Sources</h3>
    <pre>{JSON.stringify(data.byDistrictJson, null, 4)}</pre>
  </Layout>
);

export const query = graphql`
  query ByDistrict2019Query($number: Int) {
    byDistrictJson(number: { eq: $number }) {
      projections {
        calculatedPolitics {
          confidence
          party
        }
        threethirtyeight {
          confidence
          party
        }
      }
      scores {
        party
        score
      }
      number
    }
  }
`;

export default District;
