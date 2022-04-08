import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { ProSidebar, SidebarHeader, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import items from "./items";

import sidebarBanner from "../../../assets/images/sidebar-banner.png";
import sidebarCollapsedBanner from "../../../assets/images/sidebar-collapsed-banner.png";
import sidebarBg from "../../../assets/images/sidebar-bg-2.jpg";

import "./index.scss";

function Sidebar({ hidden, collapsed, history, location }) {
    const ismounted = useRef(false);
    useEffect(() => {
        ismounted.current = true;
        return () => {
            ismounted.current = false;
        };
    }, []);

    const ref = useRef(null);
    useEffect(() => {
        if (hidden) hide();
        else show();
    }, [hidden]);

    function hide() {
        ref.current.classList.add("cl-home-sidebar-hidden");
    }
    function show() {
        ref.current.classList.remove("cl-home-sidebar-hidden");
    }

    function isItemActive(itemPathname) {
        if (!location) return false;
        return location.pathname === itemPathname;
    }
    function onItemClick(item) {
        if (!history || !item) return;

        history.push(item.pathname);
    }

    return (
        <div ref={ref} id="cl-home-sidebar">
            <ProSidebar width="240px" collapsed={collapsed} toggled="CL" image={sidebarBg}>
                <SidebarHeader>
                    <div className="text-center py-2">
                        <img
                            src={collapsed ? sidebarCollapsedBanner : sidebarBanner}
                            style={collapsed ? { width: "40px", height: "40px" } : { width: "80px", height: "40px" }}
                        />
                    </div>
                </SidebarHeader>
                <Menu iconShape="circle">
                    {items.map((item, index) => {
                        // DIVIDER
                        if (item.divider) {
                            return <div key={index} className="cl-home-sidebar-menu-divider" />;
                        }

                        if (item.items) {
                            return (
                                <SubMenu key={index} title="Components" icon={<FontAwesomeIcon icon={item.icon} />}>
                                    {item.items.map((subitem, subIndex) => {
                                        return (
                                            <SubmenuItem
                                                key={subIndex}
                                                title={subitem.title}
                                                icon={subitem.icon}
                                                active={isItemActive(subitem.pathname)}
                                                onClick={() => onItemClick(subitem)}
                                            />
                                        );
                                    })}
                                </SubMenu>
                            );
                        }

                        return (
                            <MenuItem
                                key={index}
                                icon={<FontAwesomeIcon icon={item.icon} />}
                                active={isItemActive(item.pathname)}
                                onClick={() => onItemClick(item)}
                            >
                                {item.title}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </ProSidebar>
        </div>
    );
}
Sidebar.propTypes = {
    hidden: PropTypes.bool.isRequired,
    collapsed: PropTypes.bool.isRequired,
    location: PropTypes.any,
    history: PropTypes.any,
};

function SubmenuItem({ title, icon, active, onClick }) {
    return (
        <MenuItem
            onClick={onClick ? onClick : null}
            active={active}
            prefix={
                <div style={{ width: "20px" }}>
                    <FontAwesomeIcon icon={icon} />
                </div>
            }
        >
            {title}
        </MenuItem>
    );
}
SubmenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.array.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func,
};
SubmenuItem.defaultProps = {
    active: false,
    onClick: null,
};

export default withRouter(Sidebar);
