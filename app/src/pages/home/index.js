import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Sidebar from "./sidebar";
import Header from "./header";
import Content from "./content";
import Footer from "./footer";

import { ShowSidebar, HideSidebar, CollapseSidebar, UncollapseSidebar } from "../../reducer/actions";

import "./index.scss";

function Home() {
    const ismounted = useRef(false);
    const sidebarWrapperRef = useRef(null);
    const dispatch = useDispatch();
    const sidebarStatus = useSelector((state) => state.sidebar);
    const [currentWindowWidth, setCurrentWindowWidth] = useState(-1);

    useEffect(() => {
        ismounted.current = true;

        window.addEventListener("resize", onresize);
        onresize();

        // UNMOUNT
        return () => {
            window.removeEventListener("resize", onresize);
            ismounted.current = false;
        };
    }, []);

    const onresize = () => {
        const currentWidth = window.innerWidth;
        if (currentWidth < 576) {
            hideSidebar();
        } else {
            showSidebar(false);
        }
        setCurrentWindowWidth(currentWidth);
    };

    function onToggleSidebar() {
        if (currentWindowWidth > 576) {
            if (!sidebarStatus.collapsed) {
                collapseSidebar();
            } else {
                unCollapseSidebar();
            }
        } else {
            if (!sidebarStatus.hidden) {
                hideSidebar();
            } else {
                showSidebar();
            }
        }
    }
    function collapseSidebar() {
        dispatch(CollapseSidebar());
    }
    function unCollapseSidebar() {
        dispatch(UncollapseSidebar());
    }
    function showSidebar(uncollapseSidebar = true) {
        sidebarWrapperRef.current.classList.add("cl-home-sidebar-wrapper-show");
        dispatch(ShowSidebar(uncollapseSidebar));
    }
    function hideSidebar() {
        sidebarWrapperRef.current.classList.remove("cl-home-sidebar-wrapper-show");
        dispatch(HideSidebar());
    }

    return (
        <div id="cl-home">
            <div ref={sidebarWrapperRef} id="cl-home-sidebar-wrapper">
                <Sidebar hidden={sidebarStatus.hidden} collapsed={sidebarStatus.collapsed} />
                <div className="cl-home-sidebar-overlay" onClick={hideSidebar} />
            </div>

            <div className="cl-home-wrapper">
                <Header onToggleSidebar={onToggleSidebar} />
                <Content />
                <Footer />
            </div>
        </div>
    );
}

export default Home;
