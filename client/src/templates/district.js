import React from "react";
import { graphql } from "gatsby";
import { css } from "@emotion/core";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { addPartyDetails, projections } from "../utils/utils";
import Image from "../components/image";

const getConfidenceString = score => {
  if (score > 0.75) {
    return "High";
  } else if (score > 0.5) {
    return "Medium";
  } else if (score > 0) {
    return "Low";
  } else {
    return "N/A";
  }
};

const District = ({ data, pageContext }) => {
  const districtName = pageContext.name.replace(/--/g, "—");
  const winner = data.byDistrictJson.winner;
  const winningParty =
    winner && winner.party ? addPartyDetails({ name: winner.party }) : null;
  return (
    <Layout selectedDistrict={data.byDistrictJson.number}>
      <SEO title={districtName} />
      <span
        css={css`
          font-size: 0.85rem;
        `}
      >
        <Link to="/">← Back to federal projection</Link>
      </span>
      <h2
        css={css`
          margin-top: 1.5rem;
          margin-bottom: -0.8rem;
        `}
      >
        {districtName}
      </h2>
      <h3>Projected winner</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Party</th>
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
                  alt={(winningParty && winningParty.longName) || "Unknown"}
                  src={(winningParty && winningParty.imageString) || "ind.png"}
                />
              ) : (
                <Image alt="Toss up" src={"ind.png"} />
              )}
            </td>
            <td>{winningParty ? winningParty.longName : "Toss up"}</td>
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
                      <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={projections[projectionName].url}
                      >
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
                      <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={projections[projectionName].url}
                      >
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
      winner {
        party
        score
      }
      number
    }
  }
`;

export default District;
