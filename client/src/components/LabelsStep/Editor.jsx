import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';
import { Input } from '../../lib/custom-ui';

import LabelColors from '../../constants/LabelColors';

import styles from './Editor.module.scss';
import globalStyles from '../../styles.module.scss';

const LEGACY_COLORS = {
  'berry-red': '#e04556',
  'pumpkin-orange': '#f0982d',
  'lagoon-blue': '#109dc0',
  'pink-tulip': '#f97394',
  'light-mud': '#c7a57b',
  'orange-peel': '#fab623',
  'bright-moss': '#a5c261',
  'antique-blue': '#6c99bb',
  'dark-granite': '#8b8680',
  'lagune-blue': '#00b4b1',
  'sunny-grass': '#bfca02',
  'morning-sky': '#52bad5',
  'light-orange': '#ffc66d',
  'midnight-blue': '#004d73',
  'tank-green': '#8aa177',
  'gun-metal': '#355263',
  'wet-moss': '#4a8753',
  'red-burgundy': '#ad5f7d',
  'light-concrete': '#afb0a4',
  'apricot-red': '#fc736d',
  'desert-sand': '#edcb76',
  'navy-blue': '#166a8f',
  'egg-yellow': '#f7d036',
  'coral-green': '#2b6a6c',
  'light-cocoa': '#87564a',
}; // TODO delete

const Editor = React.memo(({ data, onFieldChange }) => {
  const [t] = useTranslation();

  const nameField = useRef(null);

  useEffect(() => {
    nameField.current.select();
  }, []);

  return (
    <>
      <div className={styles.text}>{t('common.title')}</div>
      <Input
        fluid
        ref={nameField}
        name="name"
        value={data.name}
        className={styles.field}
        onChange={onFieldChange}
      />
      <div className={styles.text}>{t('common.color')}</div>
      <div className={styles.colorButtons}>
        {LabelColors.map((color) => (
          <Button
            key={color}
            type="button"
            name="color"
            value={color}
            style={{
              '--background': color.includes('#') ? color : LEGACY_COLORS[color],
            }}
            className={classNames(
              styles.colorButton,
              color === data.color && styles.colorButtonActive,
              globalStyles.backgroundVariant,
            )}
            onClick={onFieldChange}
          />
        ))}
        <Button
          type="button"
          name="color"
          value="#ff0000"
          style={{
            '--background':
              'linear-gradient(to bottom right, red, orange, yellow, green, blue, indigo, violet)',
          }}
          className={classNames(
            styles.colorButton,
            data.color === '#ff0000' && styles.colorButtonActive,
            globalStyles.backgroundVariant,
          )}
          onClick={onFieldChange}
        />
      </div>
    </>
  );
});

Editor.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onFieldChange: PropTypes.func.isRequired,
};

export default Editor;
