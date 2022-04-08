import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard"));
const Accordion = React.lazy(() => import("./views/accordion"));
const Alerts = React.lazy(() => import("./views/alerts"));
const Badge = React.lazy(() => import("./views/badge"));
const Buttons = React.lazy(() => import("./views/buttons"));
const Profile = React.lazy(() => import("./views/profile"));
const Settings = React.lazy(() => import("./views/settings"));
const ContentNotFound = React.lazy(() => import("./views/content-not-found"));

const routes = [
    { path: "/", exact: true, name: "Dashboard" },
    { path: "/dashboard", exact: false, name: "Dashboard", component: Dashboard },
    { path: "/accordion", exact: true, name: "Accordion", component: Accordion },
    { path: "/alerts", exact: false, name: "Alerts", component: Alerts },
    { path: "/badge", exact: false, name: "Badge", component: Badge },
    { path: "/buttons", exact: false, name: "Buttons", component: Buttons },
    { path: "/settings", exact: false, name: "Settings", component: Settings },
    { path: "/profile", exact: false, name: "Profile", component: Profile },

    { path: "*", name: "404 Page Not Found", component: ContentNotFound },
];

export default routes;
