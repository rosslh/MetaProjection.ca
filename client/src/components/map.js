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
                > * {
                  height: 350px;
                  width: 100%;
                }
              `}
            >
              {typeof window !== "undefined" ? (
                <Map
                  center={position}
                  zoom={selectedDistrict ? null : 3.5}
                  bounds={selectedDistrict ? getBounds() : null}
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
                            prefetchPathname(`/district/${district.number}`);
                          }
                        }}
                        onMouseOut={e => {
                          e.target.closePopup();
                        }}
                        onClick={() => navigate(`/district/${district.number}`)}
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
                    height: 350px;
                    width: 100%;
                  `}
                />
              )}
            </div>
            <FindDistrict
              districts={allByDistrictJson.nodes}
              currentDistrict={selectedDistrict}
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
