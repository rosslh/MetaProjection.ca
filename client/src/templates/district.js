import React from "react";
import { graphql } from "gatsby";
import { css } from "@emotion/core";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { addPartyDetails, projections } from "../utils/utils";
import Image from "../components/image";

const getWinner = data => {
  const winner = data.byDistrictJson.scores.reduce((prev, current) => {
    return prev.score > current.score ? prev : current;
  });
  if (winner.score < 0.5) {
    return null;
  }
  return winner;
};
const getConfidenceString = confidence => {
  if (confidence < 0.5) {
    return "Toss up";
  } else if (confidence <= 0.75) {
    return "Somewhat confident";
  } else {
    return "Very confident";
  }
};

const District = ({ data, pageContext }) => {
  const winner = getWinner(data);
  const winningParty = winner ? addPartyDetails({ name: winner.party }) : null;
  return (
    <Layout>
      <SEO title="District" />
      <Link to="/">← Back to federal projection</Link>
      <h2
        css={css`
          margin-top: 2rem;
        `}
      >
        {pageContext.name.replace(/--/g, "—")}
      </h2>
      <h3>Likely winner</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Party</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              css={css`
                width: 4rem;
                height: 4rem;
              `}
            >
              {winner ? (
                <Image
                  alt={winningParty.longName}
                  src={winningParty.imageString}
                />
              ) : (
                <Image alt="Toss up" src={"ind.png"} />
              )}
            </td>
            <td>{winner ? winningParty.longName : "Toss up"}</td>
            <td>{winner ? getConfidenceString(winner.score) : ""}</td>
          </tr>
        </tbody>
      </table>
      <h3>Sources</h3>
      <table>
        <thead>
          <tr>
            <th>Site</th>
            <th>Projected winner</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data.byDistrictJson.projections).map(projectionName => {
            const projection = data.byDistrictJson.projections[projectionName];
            if (projection.party) {
              const winner = addPartyDetails({ name: projection.party });
              return (
                <tr key={projectionName}>
                  <td>
                    {
                      <a target="_blank" href={projections[projectionName].url}>
                        {projections[projectionName].name}
                      </a>
                    }
                  </td>
                  <td>{winner.longName}</td>
                  <td>{getConfidenceString(projection.confidence)}</td>
                </tr>
              );
            } else {
              return (
                <tr key={projectionName}>
                  <td>
                    {
                      <a target="_blank" href={projections[projectionName].url}>
                        {projections[projectionName].name}
                      </a>
                    }
                  </td>
                  <td
                    css={css`
                      font-style: italic;
                    `}
                  >
                    Toss up
                  </td>
                  <td>N/A</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </Layout>
  );
};

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
