/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Input } from "antd";
import useDebounce from "../hooks/useDebounce";

const InputNumber = React.forwardRef(
  (
    { value: defaultValue, onChange, debounce = true, step, ...restProps },
    ref,
  ) => {
    const [state, setState] = useState(defaultValue);

    useEffect(() => setState(defaultValue), [defaultValue]);

    const [debouncedUpdate] = useDebounce(value => onChange(value), 200);

    return (
      <Input
        {...restProps}
        ref={ref}
        type="number"
        step={step || "any"}
        value={state}
        onChange={e => {
          const value = parseFloat(e.target.value);
          if (debounce) {
            setState(isNaN(value) ? null : value);
            debouncedUpdate(isNaN(value) ? null : value);
          }
          if (!debounce) {
            setState(isNaN(value) ? null : value);
            onChange(isNaN(value) ? null : value);
          }
        }}
      />
    );
  },
);

InputNumber.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  step: PropTypes.number,
};

InputNumber.defaultProps = {
  onChange: () => {},
  step: null,
};

export default InputNumber;
