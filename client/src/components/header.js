import { Link } from "gatsby";
import React from "react";
import { css } from "@emotion/core";
import { FaCanadianMapleLeaf } from "react-icons/fa";

const Header = ({ shadow }) => (
  <header
    css={css`
      width: 100%;
      background-color: white;
      padding: 1rem 0;
      ${shadow ? "box-shadow: 0px 1px 2px 0px rgba(40, 40, 40, 0.1);" : ""}
    `}
  >
    <div
      className="contentWrapper"
      css={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        > a.logo {
          color: #191919;
          background-image: none;
        }
      `}
    >
      <Link className="logo" to="/">
        <span
          className="brandColor"
          css={css`
            position: relative;
            top: 0.15rem;
          `}
        >
          <FaCanadianMapleLeaf />
        </span>{" "}
        MetaProjection
      </Link>
      <div
        css={css`
          > * {
            margin: 0 0.7rem;
          }
        `}
      >
        <Link to="/about">About</Link>
        <a
          href="https://github.com/rosslh/metaprojection"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </div>
    </div>
  </header>
);

export default Header;
