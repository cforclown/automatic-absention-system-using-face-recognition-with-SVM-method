import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

import useOnOutsideClick from "../../handlers/use-on-outside-click";

export function DropdownMenu({ children }) {
    return <div className="cl-ddmenu">{children}</div>;
}

export function DropdownMenuToggler({ children }) {
    const togglerRef = useRef(null);
    return (
        <div togglerRef={togglerRef} className="cl-ddmenu-toggler cl-ddmenu-toggler-round">
            {children}
        </div>
    );
}

export function DropdownMenuContent({ children }) {
    // const ismounted = useRef(false);
    const contentRef = useRef(null);
    // const [state, setState] = useState({
    //     parent: null,
    // });
    // useEffect(() => {
    //     ismounted.current = true;

    //     const parent = document.getelem;

    //     return () => (ismounted.current = false);
    // }, []);
    // useOnOutsideClick(
    //     contentRef,
    //     () => {
    //         if (contentRef.current.classList.contains("tm-toggler-content-active")) contentRef.current.classList.remove("tm-toggler-content-active");
    //     },
    //     accBtnTogglerRef
    // );
    return (
        <div ref={contentRef} className="cl-ddmenu-content">
            {children}
        </div>
    );
}

export function DropdownMenuContentHeader({ children }) {
    return <div className="cl-ddmenu-content-header">{children}</div>;
}
export function DropdownMenuContentBody({ children }) {
    return <div className="cl-ddmenu-content-body">{children}</div>;
}
export function DropdownMenuContentFooter({ children }) {
    return <div className="cl-ddmenu-content-footer">{children}</div>;
}
