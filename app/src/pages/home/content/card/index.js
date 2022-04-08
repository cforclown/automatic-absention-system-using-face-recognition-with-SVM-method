import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

export function Card({ children }) {
    return <div className="cl-content-card">{children}</div>;
}
Card.propTypes = {
    children: PropTypes.any,
};

export function CardBody({ children, className }) {
    return <div className={`cl-content-card-body ${className}`}>{children}</div>;
}
CardBody.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
};

export function CardFooter({ children }) {
    return <div className="cl-content-card-footer">{children}</div>;
}
CardFooter.propTypes = {
    children: PropTypes.any,
};

export function CardHeader({ children }) {
    return <div className="cl-content-card-header">{children}</div>;
}
CardHeader.propTypes = {
    children: PropTypes.any,
};
