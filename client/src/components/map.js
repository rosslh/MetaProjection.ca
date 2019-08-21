import PropTypes from "prop-types"
import React from "react"
import { css } from "@emotion/core"

const Map = ({ selectedDistrict }) => (
  <div
    css={css`
      height: 400px;
      background-color: #e3e9f0;
    `}
  >
    Map...
  </div>
)

Map.propTypes = {
  selectedDistrict: PropTypes.number,
}

Map.defaultProps = {
  siteTitle: null,
}

export default Map
