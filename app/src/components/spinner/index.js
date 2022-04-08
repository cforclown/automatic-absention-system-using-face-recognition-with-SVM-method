import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

/**
 *
 * USAGE ====================================================================
 * <Spinner />
 * <Spinner size='sm/md/lg' />
 * <Spinner color='primary/info/secondary/warning/danger' />
 * <Spinner size='sm/md/lg' color='primary/info/secondary/warning/danger' />
 * ==========================================================================
 *
 */

function Spinner({ size, color }) {
    return (
        <div className={`spinner ${size ? `spinner-${size}` : ""} ${color ? `spinner-${color}` : "spinner-primary"}`}>
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>
    );
}

Spinner.propTypes = {
    size: PropTypes.string,
    color: PropTypes.string,
};

export default Spinner;
