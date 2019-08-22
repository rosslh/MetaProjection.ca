import React from "react";
import { css } from "@emotion/core";

const Header = () => (
  <footer
    css={css`
      width: 100%;
      margin-top: 1rem;
      border-top: 1px solid #eee;
      padding: 1rem;
    `}
  >
    <div className="contentWrapper">
      Made by <a href="https://rosshill.ca">Ross Hill</a>
    </div>
  </footer>
);

export default Header;
