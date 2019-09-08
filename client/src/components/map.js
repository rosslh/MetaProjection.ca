import PropTypes from "prop-types";
import React from "react";
import { css } from "@emotion/core";
import { StaticQuery, graphql } from "gatsby";
import { Map, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { addPartyDetails } from "../utils/utils";

const position = [52, -95];

const getPartyDetails = winner => {
  return addPartyDetails({ name: winner.party || "" });
};

const getOpacity = score => {
  if (score > 0.75) {
    return 0.9;
  } else if (score > 0.5) {
    return 0.75;
  } else {
    return 0.6;
  }
};

const getConfidenceScore = score => {
  if (score >= 1) {
    return "High";
  } else if (score > 0.5) {
    return "Medium";
  } else {
    return "N/A";
  }
};

const getFillOpacity = score => getOpacity(score) / 3;

const DistrictMap = ({ selectedDistrict }) => {
  if (typeof window !== "undefined") {
    return (
      <StaticQuery
        query={graphql`
          query MyQuery {
            allByDistrictJson {
              nodes {
                winner {
                  score
                  party
                }
                position {
                  x
                  y
                }
                number
                name
              }
            }
          }
        `}
        render={({ allByDistrictJson }) => (
          <div
            css={css`
              > * {
                height: 350px;
                width: 100%;
              }
            `}
          >
            <Map center={position} zoom={3.5}>
              <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {allByDistrictJson.nodes.map(district => (
                <CircleMarker
                  key={district.number}
                  stroke={district.winner.party}
                  opacity={getOpacity(district.winner.score)}
                  fillOpacity={getFillOpacity(district.winner.score)}
                  color={getPartyDetails(district.winner).color}
                  center={[district.position.x, district.position.y]}
                  radius={5}
                >
                  <Popup>
                    <strong>Riding</strong>: {district.name}
                    <br />
                    <strong>Winner</strong>:{" "}
                    {getPartyDetails(district.winner).longName || "Toss-up"}
                    <br />
                    <strong>Confidence</strong>:{" "}
                    {getConfidenceScore(district.winner.score)}
                  </Popup>
                </CircleMarker>
              ))}
            </Map>
          </div>
        )}
      />
    );
  }
};

DistrictMap.propTypes = {
  selectedDistrict: PropTypes.number,
};

DistrictMap.defaultProps = {
  siteTitle: null,
};

export default DistrictMap;
