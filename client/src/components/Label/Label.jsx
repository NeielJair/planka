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

const Label = React.memo(({ name, color, size, isDisabled, onClick }) => {
  const contentNode = (
    <div
      title={name}
      style={{
        '--background': color,
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
