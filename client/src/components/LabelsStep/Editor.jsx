import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Input } from "../../lib/custom-ui";

import LabelColors from "../../constants/LabelColors";

import styles from "./Editor.module.scss";
import { SketchPicker } from "react-color";

const Editor = React.memo(({ data, onFieldChange }) => {
  const [t] = useTranslation();

  const [customColor, setCustomColor] = useState("#ff0000");

  const nameField = useRef(null);

  useEffect(() => {
    nameField.current.select();
  }, []);

  return (
    <>
      <div className={styles.text}>{t("common.title")}</div>
      <Input
        fluid
        ref={nameField}
        name="name"
        value={data.name}
        className={styles.field}
        onChange={onFieldChange}
      />
      <div className={styles.text}>{t("common.color")}</div>
      <div className={styles.colorButtons}>
        <SketchPicker
          presetColors={LabelColors}
          color={customColor}
          onChange={(color) => {
            setCustomColor(color.hex);
            onFieldChange(undefined, { name: "color", value: color.hex });
          }}
          className={styles.sketchPicker}
        />
      </div>
    </>
  );
});

Editor.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onFieldChange: PropTypes.func.isRequired
};

export default Editor;
