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
          MetaProjection will be back for the next Canadian federal election.
        </p>
        <p>In the meantime, view the final projection for 2021 here:</p>
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
