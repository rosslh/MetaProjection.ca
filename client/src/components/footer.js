import React from "react";
import { css } from "@emotion/core";

const Header = () => (
  <footer
    css={css`
      height: 2rem;
      width: 100%;
      margin-top: 1rem;
    `}
  >
    <div className="contentWrapper">Made by Ross Hill</div>
  </footer>
);

export default Header;
