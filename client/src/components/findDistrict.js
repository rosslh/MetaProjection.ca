import React, { useState } from "react";
import { css, ClassNames } from "@emotion/core";
import PropTypes from "prop-types";
import Select from "react-select";
import { navigate } from "gatsby";
import { IoMdPin } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import { observer, inject } from "mobx-react";

const FindDistrict = inject(`store`)(
  observer(({ store, districts, selectedDistrict }) => {
    const options = districts.map(d => ({
      value: d.number,
      label: d.name,
    }));

    const [selectedOption, setSelectedOption] = useState(null);

    const handleChange = option => {
      navigate(`/district/${option.value}`);
      setSelectedOption(option);
    };

    const geolocationApiAvailable = () => {
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
      if (geolocationApiAvailable()) {
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
                  const userDistrict = r.objects[0].external_id;
                  store.SetDistrict(Number(userDistrict));
                  store.SetGeolocationDisabled(false);
                  navigate(`/district/${userDistrict}`);
                } else {
                  store.SetGeolocationDisabled(true);
                }
              })
              .catch(() => {
                store.SetGeolocationDisabled(true);
              });
          },
          () => {
            // err
            store.SetGeolocationDisabled(true);
          }
        );
      } else {
        store.SetGeolocationDisabled(true);
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
          {/* <pre>{JSON.stringify(store, null, 2)}</pre> */}
          {geolocationApiAvailable() &&
          store.UserDistrict !== selectedDistrict ? (
            <div>
              <button
                css={css`
                  line-height: ${store.UserGeolocationDisabled
                    ? "1.5rem"
                    : "2rem"};
                  padding: 0 1rem;
                  border-radius: 2rem;
                  background-color: ${store.UserGeolocationDisabled
                    ? "#fdfdfd"
                    : "#950451"};
                  color: ${store.UserGeolocationDisabled ? "#555" : "white"};
                  font-weight: ${store.UserGeolocationDisabled
                    ? "normal"
                    : "bold"};
                  display: inline-flex;
                  justify-content: center;
                  align-items: center;
                  border: ${store.UserGeolocationDisabled
                    ? "2px solid #777;"
                    : "none"};
                  box-sizing: content-box;
                  cursor: pointer;
                  :hover {
                    opacity: 0.9;
                  }
                `}
                onClick={geolocate}
                id="geolocate"
              >
                {store.UserGeolocationDisabled ? (
                  <>
                    <span
                      css={css`
                        font-size: 1.1rem;
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
          {store.UserDistrict === selectedDistrict ? (
            <div>
              <div
                css={css`
                  color: #950451;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <IoMdPin />
                &nbsp;Your riding
              </div>
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
  })
);

FindDistrict.propTypes = {
  districts: PropTypes.arrayOf(PropTypes.object),
};

export default FindDistrict;
