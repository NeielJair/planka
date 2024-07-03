import upperFirst from 'lodash/upperFirst';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Label.module.scss';
import globalStyles from '../../styles.module.scss';

const SIZES = {
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'medium',
};

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

const Label = React.memo(({ name, color, size, isDisabled, onClick }) => {
  const contentNode = (
    <div
      title={name}
      style={{
        '--background': color.includes('#') ? color : LEGACY_COLORS[color],
      }}
      className={classNames(
        styles.wrapper,
        !name && styles.wrapperNameless,
        styles[`wrapper${upperFirst(size)}`],
        onClick && styles.wrapperHoverable,
        globalStyles.backgroundVariant,
      )}
    >
      {name || '\u00A0'}
    </div>
  );

  return onClick ? (
    <button type="button" disabled={isDisabled} className={styles.button} onClick={onClick}>
      {contentNode}
    </button>
  ) : (
    contentNode
  );
});

Label.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string.isRequired,
  size: PropTypes.oneOf(Object.values(SIZES)),
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Label.defaultProps = {
  name: undefined,
  size: SIZES.MEDIUM,
  isDisabled: false,
  onClick: undefined,
};

export default Label;
