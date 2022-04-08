import React from "react";

import "./index.scss";

function Footer() {
    return (
        <div id="cl-home-footer">
            <div className="cl-home-footer-left"></div>
            <div className="cl-home-footer-center"></div>
            <div className="cl-home-footer-right">
                Copyright © 2021
                <span className="ms-1">
                    <a target="_blank" rel="noreferrer" href="https://hafisalrizal.com">
                        hafis alrizal
                    </a>
                </span>
            </div>
        </div>
    );
}

export default Footer;
