import React from "react";
import { css } from "@emotion/core";

const Header = () => (
  <footer
    css={css`
      width: 100%;
      margin-top: 4rem;
      border-top: 1px solid #eee;
      padding: 1rem;
      background-color: white;
    `}
  >
    <div className="contentWrapper">
      Made by <a href="https://rosshill.ca">Ross Hill</a>
    </div>
  </footer>
);

export default Header;
