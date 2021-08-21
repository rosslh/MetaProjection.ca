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
import ShareButtons from "../components/shareButtons";

const getPartyStatus = (rank, seats) => {
  switch (rank) {
    case 0:
      return seats > 169
        ? "Likely Majority Government"
        : "Likely Minority Government";
    case 1:
      return "Likely Official Opposition";
    default:
      return null;
  }
};
const pageTitle = "Federal overview";
const IndexPage = () => (
  <StaticQuery
    query={graphql`
      query Federal2021Query {
        federalJson {
          parties {
            avg
            name
            projections {
              calculatedPolitics
              # cdnElectionWatch # TODO: enable once projection is up
              threethirtyeight
              cbc
            }
          }
        }
      }
      # query Federal2019Query {
      #   federalJson2019: federalJson {
      #     parties {
      #       avg
      #       name
      #       projections {
      #         calculatedPolitics
      #         cdnElectionWatch
      #         threethirtyeight
      #         cbc
      #       }
      #     }
      #   }
      # }
    `}
    render={({ federalJson }) => (
      <Layout>
        <SEO title={pageTitle} />
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
          `}
        >
          Aggregated from{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={projections["calculatedPolitics"].url}
          >
            {projections["calculatedPolitics"].name}
          </a>
          ,{" "}
          {/* <a
            target="_blank"
            rel="noopener noreferrer"
            href={projections["cdnElectionWatch"].url}
          >
            {projections["cdnElectionWatch"].name}
          </a>
          ,{" "} */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={projections["threethirtyeight"].url}
          >
            {projections["threethirtyeight"].name}
          </a>
          , and{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={projections["cbc"].url}
          >
            {projections["cbc"].name}
          </a>
        </p>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Party</th>
              <th>Seats</th>
            </tr>
          </thead>
          <tbody>
            {federalJson.parties
              .sort((a, b) => b.avg - a.avg)
              .map(party => addPartyDetails(party))
              .map((party, i) => (
                <tr key={party.name}>
                  <td
                    css={css`
                      min-width: 4rem;
                      min-height: 4rem;
                      width: 4rem;
                      height: 4rem;
                    `}
                  >
                    <Image
                      className="party-logo"
                      alt={party.longName}
                      src={party.imageString}
                    />
                  </td>
                  <td>{party.longName}</td>
                  <td
                    css={css`
                      font-size: 1.5rem;
                      font-weight: bold;
                      display: flex;
                      justify-content: space-between;
                      align-items: middle;
                      width: 6rem;
                    `}
                  >
                    <span>{Math.round(party.avg)}</span>
                    <span
                      css={css`
                        color: #545454;
                        margin-left: 0.5rem;
                        font-size: 1.1rem;
                        padding-top: 0.1rem;
                      `}
                    >
                      {/* see layout.css */}
                      <Popup
                        hoverable
                        content={
                          <FederalDetailPopup
                            data={party.projections}
                            avg={party.avg}
                            status={getPartyStatus(i, Math.round(party.avg))}
                          />
                        }
                        trigger={<MdInfoOutline className="infoIcon" />}
                      />
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <ShareButtons title={pageTitle} page="" />
        <div
          css={css`
            margin: 4rem 0 2rem;
          `}
        >
          <p>
            View the final projection for 2019 here:
            <a
              href={"https://2019.metaprojection.ca"}
              css={css`
                height: 1.5rem;
                border-radius: 2rem;
                border: none;
                background-color: #950451;
                color: white;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                padding: 0 0.8rem;
                text-shadow: none;
                font-size: 0.8rem;
                margin-left: 0.5rem;
              `}
            >
              MetaProjection 2019
            </a>
          </p>
        </div>
      </Layout>
    )}
  />
);

export default IndexPage;
