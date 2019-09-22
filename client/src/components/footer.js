import React from "react";
import { css } from "@emotion/core";
import { formatDistanceToNow } from "date-fns";

const Footer = ({ publishTimestamp }) => {
  const generatedAgo = formatDistanceToNow(publishTimestamp);
  return (
    <footer
      className="footer"
      css={css`
        width: 100%;
        margin-top: 3.5rem;
        border-top: 1px solid #eee;
        padding: 1rem;
        background-color: white;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
        className="contentWrapper"
      >
        <span>
          Made by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://rosshill.ca"
          >
            Ross Hill
          </a>
        </span>
        <span>Last updated {generatedAgo} ago</span>
      </div>
    </footer>
  );
};

export default Footer;
