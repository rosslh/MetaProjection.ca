import React, { useState } from "react";
import { css, ClassNames } from "@emotion/core";
import PropTypes from "prop-types";
import Select from "react-select";
import { navigate } from "gatsby";
import { IoMdPin } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import { getDistance } from "geolib";

const FindDistrict = ({ districts, selectedDistrict }) => {
  const options = districts.map(d => ({
    value: d.number,
    label: d.name,
  }));

  const [selectedOption, setSelectedOption] = useState(null);

  const [buttonError, setButtonError] = useState(false);

  const handleChange = option => {
    navigate(`/district/${option.value}`);
    setSelectedOption(option);
  };

  const geolocationEnabled = () => {
    try {
      return (
        navigator &&
        navigator.geolocation &&
        navigator.geolocation.getCurrentPosition
      );
    } catch (e) {
      return false;
    }
  };

  const geolocate = () => {
    // TODO: use mobx to store user's riding
    if (geolocationEnabled()) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          fetch(
            `https://represent.opennorth.ca/boundaries/?contains=${userLocation.latitude},${userLocation.longitude}&sets=federal-electoral-districts`
          )
            .then(r => r.json())
            .then(r => {
              if (r && r.objects && r.objects.length === 1) {
                navigate(`/district/${r.objects[0].external_id}`);
              } else {
                setButtonError(true);
              }
            })
            .catch(() => {
              const districtDistances = districts.map(d => ({
                number: d.number,
                distance: getDistance(userLocation, {
                  latitude: d.position.x,
                  longitude: d.position.y,
                }),
              }));
              const closest = districtDistances.reduce((prev, curr) => {
                return prev.distance < curr.distance ? prev : curr;
              });
              navigate(`/district/${closest.number}`);
            });
        },
        () => {
          // err
          setButtonError(true);
        }
      );
    } else {
      setButtonError(true);
    }
  };

  return (
    <div
      css={css`
        width: 100%;
        background-color: white;
        padding: 0.5rem 0;
        margin-bottom: 1.2rem;
        border-top: 1px solid #eee;
        font-size: 0.9rem;
        box-shadow: 0px 1px 2px 0px rgba(40, 40, 40, 0.1);
      `}
    >
      <div
        className="contentWrapper"
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;

          @media (max-width: 650px) {
            > * {
              width: 100%;
              padding: 0.3rem 0;
              text-align: center;
            }
            padding: 0.3rem 0.6rem;
            flex-wrap: wrap;
          }
          @media (min-width: 650px) {
            > * {
              max-width: 40%;
            }
            padding-top: 0.3rem;
            padding-bottom: 0.3rem;
          }
          > * {
            flex-grow: 1;
            min-width: 10rem;
          }
        `}
      >
        {geolocationEnabled() ? (
          <div>
            <button
              css={css`
                line-height: ${buttonError ? "1.5rem" : "2rem"};
                padding: 0 1rem;
                border-radius: 2rem;
                background-color: ${buttonError ? "#fafafa" : "#950451"};
                color: ${buttonError ? "#454545" : "white"};
                font-weight: ${buttonError ? "normal" : "bold"};
                display: inline-flex;
                justify-content: center;
                align-items: center;
                border: ${buttonError ? "2px solid #666;" : "none"};
                box-sizing: content-box;
                cursor: pointer;
                :hover {
                  opacity: 0.9;
                }
              `}
              onClick={geolocate}
              id="geolocate"
            >
              {buttonError ? (
                <>
                  <span
                    css={css`
                      font-size: 1.2rem;
                      padding-bottom: 0.2rem;
                      > * {
                        vertical-align: middle;
                      }
                    `}
                  >
                    <MdErrorOutline />
                  </span>
                  &nbsp;Location services unavailable
                </>
              ) : (
                <>
                  <IoMdPin />
                  &nbsp;Find my riding
                </>
              )}
            </button>
          </div>
        ) : null}
        <div>
          {/*Hide except for screenreaders*/}
          <label
            htmlFor="districtSelect"
            css={css`
              border: 0;
              clip: rect(0 0 0 0);
              clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
              -webkit-clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
              height: 1px;
              margin: -1px;
              overflow: hidden;
              padding: 0;
              position: absolute;
              width: 1px;
              white-space: nowrap;
            `}
          >
            Select riding
          </label>
          <ClassNames>
            {({ css: style }) => (
              <Select
                isSearchable
                inputId="districtSelect"
                className={style`
                width: 100%;
                font-size: 0.8rem;
                [class$="placeholder"] {
                  color: #444;
                }
              `}
                value={selectedOption}
                onChange={handleChange}
                options={options}
                placeholder="Select riding"
              />
            )}
          </ClassNames>
        </div>
      </div>
    </div>
  );
};

FindDistrict.propTypes = {
  districts: PropTypes.arrayOf(PropTypes.object),
};

export default FindDistrict;
