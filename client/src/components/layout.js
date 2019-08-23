/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { css } from "@emotion/core";

import Header from "./header";
import Footer from "./footer";
import Map from "./map";
import "./layout.css";

const Layout = ({ noMap, children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
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
      <Header siteTitle={data.site.siteMetadata.title} />
      {noMap ? "" : <Map />}
      <div
        className="contentWrapper"
        css={css`
          margin-top: 1rem;
        `}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  noMap: PropTypes.string,
};

export default Layout;
