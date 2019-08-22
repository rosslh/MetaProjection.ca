import React from "react";
import { MdInfoOutline } from "react-icons/md";
import { Popup } from "semantic-ui-react";

import Image from "../components/image";
import { addPartyDetails, projections } from "../utils/utils";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { StaticQuery, graphql } from "gatsby";
import { css } from "@emotion/core";
import FederalDetailPopup from "../components/federalDetailPopup";

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
        <h2
          css={css`
            margin-bottom: 1rem;
          `}
        >
          Federal election projection
        </h2>
        <p
          css={css`
            font-size: 0.9rem;
            color: #666;
          `}
        >
          Aggregated from{" "}
          <a href={projections["calculatedPolitics"].url}>
            {projections["calculatedPolitics"].name}
          </a>
          ,{" "}
          <a href={projections["cdnElectionWatch"].url}>
            {projections["cdnElectionWatch"].name}
          </a>
          ,{" "}
          <a href={projections["threethirtyeight"].url}>
            {projections["threethirtyeight"].name}
          </a>
          , and <a href={projections["cbc"].url}>{projections["cbc"].name}</a>
        </p>
        <table
          css={css`
            max-width: 800px;
          `}
        >
          <thead>
            <tr
              css={css`
                th > span {
                  font-size: 0.95rem;
                  border-bottom: 1px solid #ccc;
                  padding-bottom: 0.2rem;
                  padding-right: 1rem;
                }
              `}
            >
              <th></th>
              <th>
                <span>Party</span>
              </th>
              <th>
                <span>
                  Seats{" "}
                  <span
                    css={css`
                      font-weight: normal;
                    `}
                  >
                    (out of 338)
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {federalJson.parties
              .sort((a, b) => b.avg - a.avg)
              .map(party => addPartyDetails(party))
              .map(party => (
                <tr key={party.name}>
                  <td
                    css={css`
                      width: 4rem;
                      height: 4rem;
                    `}
                  >
                    <Image alt={party.longName} src={party.imageString} />
                  </td>
                  <td>{party.longName}</td>
                  <td
                    css={css`
                      font-size: 1.5rem;
                      font-weight: bold;
                      display: flex;
                      justify-content: space-between;
                      width: 5rem;
                    `}
                  >
                    <span>{Math.round(party.avg)}</span>
                    <span
                      css={css`
                        font-size: 1rem;
                        vertical-align: middle;
                        color: #444;
                      `}
                    >
                      <Popup
                        hoverable
                        content={
                          <FederalDetailPopup
                            data={party.projections}
                            avg={party.avg}
                          />
                        }
                        trigger={<MdInfoOutline />}
                      />
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Layout>
    )}
  />
);

export default IndexPage;
