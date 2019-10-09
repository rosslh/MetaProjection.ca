import React from "react";
import PropTypes from "prop-types";
import { css, ClassNames } from "@emotion/core";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  RedditShareButton,
} from "react-share";

import {
  FaRedditAlien,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

import { useStaticQuery, graphql } from "gatsby";

function ShareLinks({ page, title }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            url
          }
        }
      }
    `
  );
  const fullTitle = `${title} | ${site.siteMetadata.title}`;
  return (
    <ClassNames>
      {({ css: style }) => (
        <div
          css={css`
            padding-top: 1rem;
            display: flex;
            align-items: center;
            .SocialMediaShareButton {
              cursor: pointer;
              :hover {
                opacity: 0.9;
              }
              margin: 0 0.3rem;
              color: white;
              display: inline-block;
              height: 1.6rem;
              width: 1.6rem;
              font-size: 0.9rem;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 50%;
              overflow: hidden;
            }
          `}
        >
          <span
            css={css`
              padding-right: 0.4rem;
            `}
          >
            Share:
          </span>
          <FacebookShareButton
            className={style`
              background-color: #3B579D;
            `}
            url={`${site.siteMetadata.url}${page}`}
            quote={fullTitle}
          >
            <FaFacebookF />
          </FacebookShareButton>
          <TwitterShareButton
            className={style`
              background-color: #2CAAE1;
            `}
            url={`${site.siteMetadata.url}${page}`}
            title={`${site.siteMetadata.description}. Take a look!`}
          >
            <FaTwitter />
          </TwitterShareButton>
          <RedditShareButton
            className={style`
              background-color: #FF4500 !important;
            `}
            title={fullTitle}
            url={`${site.siteMetadata.url}${page}`}
          >
            <FaRedditAlien />
          </RedditShareButton>
          <LinkedinShareButton
            className={style`
              background-color: #007BB6;
            `}
            url={`${site.siteMetadata.url}${page}`}
          >
            <FaLinkedinIn />
          </LinkedinShareButton>
        </div>
      )}
    </ClassNames>
  );
}

ShareLinks.propTypes = {
  page: PropTypes.string,
  title: PropTypes.string,
};

export default ShareLinks;
