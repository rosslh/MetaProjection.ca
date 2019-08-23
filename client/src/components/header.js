import { Link } from "gatsby";
import React from "react";
import { css } from "@emotion/core";

const Header = () => (
  <header
    css={css`
      width: 100%;
      background-color: white;
      padding: 1rem 0;
    `}
  >
    <div className="contentWrapper">
      <span>Logo</span>
      <Link to="/about">About</Link>
    </div>
  </header>
);

export default Header;
