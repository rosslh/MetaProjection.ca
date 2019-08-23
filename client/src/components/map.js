import PropTypes from "prop-types";
import React from "react";
import { css } from "@emotion/core";

const Map = ({ selectedDistrict }) => (
  <div
    css={css`
      height: 200px;
      background-color: #aaa;
      margin-bottom: 1.5rem;
    `}
  />
);

Map.propTypes = {
  selectedDistrict: PropTypes.number,
};

Map.defaultProps = {
  siteTitle: null,
};

export default Map;
