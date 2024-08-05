/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { css } from "@emotion/react";

import Header from "./header";
import Footer from "./footer";
// import Map from "./map";

import "./layout.css";

type Props = {
  noMap?: boolean;
  children: ReactNode;
  selectedDistrict?: number;
};

const Layout = ({ noMap, children, selectedDistrict }: Props) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          publishTimestamp
        }
      }
    }
  `);
  return (
    <div
      css={css`
        background-color: #fafafa;
      `}
    >
      <Header shadow={noMap} />
      {/* TODO: add the map back */}
      {/* {noMap ? "" : <Map selectedDistrict={selectedDistrict} />} */}
      <div
        className="contentWrapper"
        css={css`
          margin-top: 1rem;
        `}
      >
        {children}
      </div>
      <Footer publishTimestamp={data.site.siteMetadata.publishTimestamp} />
    </div>
  );
};

export default Layout;
