import React from "react";
import { css } from "@emotion/react";
import { formatDistanceToNow } from "date-fns";

type Props = {
  publishTimestamp: number;
};

const Footer = ({ publishTimestamp }: Props) => {
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
          flex-wrap: wrap;
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
        {typeof window !== "undefined" ? (
          <span>Last updated {generatedAgo} ago</span>
        ) : (
          <span />
        )}
      </div>
    </footer>
  );
};

export default Footer;
