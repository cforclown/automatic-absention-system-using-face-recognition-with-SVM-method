import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

function Scan() {
  return (
    <div id='cl-scan'>
      <div className='cl-scan-container'>

      </div>
      <div className='cl-scan-indicator' />
      <button className='cl-scan-dashboard-btn'>
        Dashboard
      </button>
    </div>
  );
}

Scan.propTypes = {
  history: PropTypes.any
};

export default Scan;
