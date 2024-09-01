import React from "react";
import { Popup } from "../../lib/custom-ui";
import { SketchPicker } from "react-color";
import PropTypes from "prop-types";

const ColorPicker = React.memo(
  ({
     color,
     onChange
   }) => {
    return (
      <>
        <Popup.Content>
          <SketchPicker
            color={color}
            onChange={onChange}
          />
        </Popup.Content>
      </>
    );
  });

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ColorPicker;
