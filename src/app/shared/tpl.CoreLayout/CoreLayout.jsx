import React, { PropTypes } from 'react';

const CoreLayout = ({ children }) => (
  <div>
  { children }
  </div>
);

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
};

export default CoreLayout;
