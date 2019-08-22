import React from "react";
import PropTypes from "prop-types";
import { css } from "@emotion/core";

import { projections } from "../utils/utils";

function FederalDetailPopup(props) {
  const keysSorted = Object.keys(props.data).sort((a, b) =>
    ("" + projections[a].name).localeCompare(projections[b].name)
  );
  return (
    <div
      css={css`
        border: 1px solid #d4d4d5;
        max-width: 250px;
        background: #fff;
        padding: 0.8rem 1em;
        border-radius: 3px;
        box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12),
          0 2px 10px 0 rgba(34, 36, 38, 0.15);
      `}
    >
      <table
        css={css`
          margin-bottom: 0.5rem;
          td {
            padding-top: 0.2rem;
            padding-bottom: 0.2rem;
          }
        `}
      >
        <tbody>
          {keysSorted.map(x => (
            <tr key={x}>
              <td>
                <a href={projections[x].url}>{projections[x].name}</a>
              </td>
              <td>{props.data[x]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <strong>Avg:</strong> {props.avg} seats
    </div>
  );
}

FederalDetailPopup.propTypes = {
  data: PropTypes.objectOf(PropTypes.number),
  avg: PropTypes.number,
};

export default FederalDetailPopup;
