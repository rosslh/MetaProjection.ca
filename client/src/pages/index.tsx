import React from "react";
import Layout from "../components/layout";
import { css } from "@emotion/react";

const Index = () => {
  return (
    <Layout noMap>
      <div
        css={css`
          margin: 2rem 0;
        `}
      >
        <p>
          MetaProjection has been archived. The site previously served as an
          aggregator for Canadian federal election projections, offering
          insights into the electoral landscape at both the federal and district
          levels.
        </p>
        <p>
          Due to the deprecation of some key technologies used in the site,
          migrating to newer systems would require significant development
          effort, which I am unable to undertake at this time. As a result,
          MetaProjection now stands as a historical archive, preserving election
          projections from the 2019 and 2021 federal elections.
        </p>
        <p>
          For current and up-to-date projections, I recommend visiting{" "}
          <a
            href="https://338canada.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            338Canada
          </a>{" "}
          and{" "}
          <a
            href="https://newsinteractives.cbc.ca/elections/poll-tracker/canada/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CBC Poll Tracker
          </a>
          . Both platforms provide reliable and timely election analysis.
        </p>
        <p>
          Thank you to everyone who supported and used MetaProjection over the
          years—it was a rewarding project to work on, and I hope it served you
          well.
        </p>
        <p>View previous projections here:</p>
        <a
          href={"https://2019.metaprojection.ca"}
          css={css`
            height: 2rem;
            border-radius: 2rem;
            border: none;
            background-color: #950451;
            color: white;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            padding: 0 1rem;
            text-shadow: none;
          `}
        >
          MetaProjection 2019
        </a>{" "}
        <a
          href={"https://2021.metaprojection.ca"}
          css={css`
            height: 2rem;
            border-radius: 2rem;
            border: none;
            background-color: #950451;
            color: white;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            padding: 0 1rem;
            text-shadow: none;
          `}
        >
          MetaProjection 2021
        </a>
      </div>
    </Layout>
  );
};

export default Index;
