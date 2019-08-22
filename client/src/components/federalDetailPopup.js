import React from "react";
import PropTypes from "prop-types";
import { css } from "@emotion/core";

import { projections } from "../utils/utils";

function FederalDetailPopup(props) {
  const keysSorted = Object.keys(props.data).sort((a, b) => a - b);
  return (
    <>
      <table
        css={css`
          margin-bottom: 1rem;
        `}
      >
        {keysSorted.map(x => (
          <tr key={x}>
            <a href={projections[x].url}>{projections[x].name}</a> :{" "}
            {props.data[x]}
          </tr>
        ))}
      </table>
      <strong>Avg:</strong> {props.avg} seats
    </>
  );
}

FederalDetailPopup.propTypes = {
  data: PropTypes.objectOf(PropTypes.string),
  avg: PropTypes.number,
};

export default FederalDetailPopup;
