import React from "react";
import PropTypes from "prop-types";
import { css } from "@emotion/react";

import { projections } from "../utils/utils";

type Props = {
  data: Record<keyof typeof projections, number>;
  avg: number;
  status?: string;
};

function FederalDetailPopup({ data, avg, status }: Props) {
  const keysSorted = Object.keys(data)
    .filter((key): key is keyof typeof projections => key in projections)
    .sort((a, b) => projections[a].name.localeCompare(projections[b].name));

  return (
    <div
      css={css`
        border: 1px solid #d4d4d5;
        max-width: 250px;
        background: #fff;
        padding: 0.8rem 1em;
        border-radius: 3px;
        box-shadow:
          0 2px 4px 0 rgba(34, 36, 38, 0.12),
          0 2px 10px 0 rgba(34, 36, 38, 0.15);
        > * {
          font-size: 0.9rem !important;
        }
      `}
    >
      <table
        className="table-projection"
        css={css`
          margin-bottom: 0.5rem;
          td {
            padding: 0.1rem 0 !important;
          }
          td:first-child {
            padding-right: 0.5rem !important;
          }
          tbody {
            border: none;
          }
        `}
      >
        <tbody>
          {keysSorted.map((x) => (
            <tr key={x}>
              <td>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={projections[x].url}
                >
                  {projections[x].name}
                </a>
              </td>
              <td>{data[x]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <strong>Avg:</strong> {avg} seats
      </div>
      {status ? (
        <div
          css={css`
            padding-top: 0.5rem;
            font-style: italic;
          `}
        >
          {status}
        </div>
      ) : null}
    </div>
  );
}

FederalDetailPopup.propTypes = {
  data: PropTypes.objectOf(PropTypes.number),
  avg: PropTypes.number,
};

export default FederalDetailPopup;
