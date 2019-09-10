import React, { useState } from "react";
import { css, ClassNames } from "@emotion/core";
import PropTypes from "prop-types";
import Select from "react-select";
import { navigate } from "gatsby";

const FindDistrict = ({ districts, currentDistrict }) => {
  const options = districts.map(d => ({
    value: d.number,
    label: d.name,
  }));

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = option => {
    navigate(`/district/${option.value}`);
    setSelectedOption(option);
  };

  const currentDistrictObject = currentDistrict
    ? districts.find(d => d.number === currentDistrict)
    : null;
  const currentDistrictOption = currentDistrict
    ? {
        value: currentDistrictObject.number,
        label: currentDistrictObject.name,
      }
    : null;

  return (
    <div
      css={css`
        width: 100%;
        background-color: white;
        padding: 0.5rem 0;
        margin-bottom: 1.5rem;
        font-size: 0.8rem;
        box-shadow: 0px 1px 2px 0px rgba(40, 40, 40, 0.1);
      `}
    >
      <div className="contentWrapper">
        <label
          css={css`
            margin-right: 0.8rem;
          `}
          htmlFor="districtSelect"
        >
          Select{currentDistrict ? "ed" : ""} district:
        </label>
        <ClassNames>
          {({ css: style }) => (
            <Select
              isSearchable
              inputId="districtSelect"
              className={style`
                width: 25rem;
                display: inline-block;
                font-size: 0.75rem;
              `}
              value={selectedOption || currentDistrictOption}
              onChange={handleChange}
              options={options}
            />
          )}
        </ClassNames>
      </div>
    </div>
  );
};

FindDistrict.propTypes = {
  districts: PropTypes.arrayOf(PropTypes.object),
};

export default FindDistrict;
