import { Link } from "gatsby";
import React from "react";
import { css } from "@emotion/core";

const Header = () => (
  <header
    css={css`
      height: 2rem;
      width: 100%;
      margin-bottom: 1rem;
    `}
  >
    <div className="contentWrapper">
      <span>Logo</span>
      <Link to="/about">About</Link>
    </div>
  </header>
);

export default Header;
