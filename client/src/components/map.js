import PropTypes from "prop-types";
import React from "react";
import { css } from "@emotion/core";
import { StaticQuery, graphql } from "gatsby";
import { Map, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { addPartyDetails } from "../utils/utils";
import { navigate, prefetchPathname } from "gatsby";
import FindDistrict from "./findDistrict";

const getPartyDetails = winner => {
  return addPartyDetails({ name: winner.party || "" });
};

const getOpacity = score => {
  if (score >= 0.5) {
    return 0.6;
  } else {
    return 0.4;
  }
};

const getConfidenceScore = score => {
  if (score > 0.75) {
    return "High";
  } else if (score > 0.5) {
    return "Medium";
  } else if (score > 0) {
    return "Low";
  } else {
    return "N/A";
  }
};

const DistrictMap = ({ selectedDistrict }) => {
  const mapHeightStyle = `
  @media (max-width: 700px) {
  height: 280px;
}
  @media (min-width: 701px) {
  height: 350px;
}
  `;

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
              bounds
              number
              name
              slug
            }
          }
        }
      `}
      render={({ allByDistrictJson }) => {
        let position = [52, -95];

        const selectedDistrictObject = allByDistrictJson.nodes.find(
          x => x.number === selectedDistrict
        );
        if (selectedDistrict) {
          position = [
            selectedDistrictObject.position.x,
            selectedDistrictObject.position.y,
          ];
        }

        const getBounds = () => {
          return selectedDistrictObject.bounds;
        };

        return (
          <>
            <div
              css={css`
                overflow: hidden;
                > * {
                  ${mapHeightStyle}
                  width: 100%;
                }
              `}
            >
              {typeof window !== "undefined" ? (
                <Map
                  center={position}
                  bounds={
                    selectedDistrict
                      ? getBounds()
                      : [[40.84, -135.79], [60.06, -49.75]]
                  }
                >
                  <TileLayer
                    url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {allByDistrictJson.nodes.map(district => {
                    const isSelected = selectedDistrict === district.number;
                    return (
                      <CircleMarker
                        key={district.number}
                        stroke={isSelected ? true : false}
                        fillOpacity={
                          isSelected ? 0.8 : getOpacity(district.winner.score)
                        }
                        color={getPartyDetails(district.winner).color}
                        center={[district.position.x, district.position.y]}
                        radius={isSelected ? 10 : 6}
                        onMouseOver={e => {
                          e.target.openPopup();
                          if (!isSelected) {
                            prefetchPathname(`/riding/${district.slug}`);
                          }
                        }}
                        onMouseOut={e => {
                          e.target.closePopup();
                        }}
                        onClick={() => navigate(`/riding/${district.slug}`)}
                      >
                        <Popup>
                          <strong>Riding</strong>: {district.name}
                          <br />
                          <strong>Winner</strong>:{" "}
                          {getPartyDetails(district.winner).longName ||
                            "Toss-up"}
                          <br />
                          <strong>Confidence</strong>:{" "}
                          {getConfidenceScore(district.winner.score)}
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </Map>
              ) : (
                <div
                  css={css`
                    ${mapHeightStyle}
                    width: 100%;
                  `}
                />
              )}
            </div>
            <FindDistrict
              districts={allByDistrictJson.nodes}
              selectedDistrict={selectedDistrict}
            />
          </>
        );
      }}
    />
  );
};

DistrictMap.propTypes = {
  selectedDistrict: PropTypes.number,
};

DistrictMap.defaultProps = {
  siteTitle: null,
};

export default DistrictMap;
