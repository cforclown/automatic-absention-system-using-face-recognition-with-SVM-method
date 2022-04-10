import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard"));
const Accordion = React.lazy(() => import("./views/accordion"));
const Profile = React.lazy(() => import("./views/profile"));
const Settings = React.lazy(() => import("./views/settings"));
const ContentNotFound = React.lazy(() => import("./views/content-not-found"));

const routes = [
  {
    path: "/", exact: true,
    name: "Dashboard",
    sidebar: {
      index: 0,
      title: "Dashboard",
      pathname: "/dashboard",
      icon: ["fas", "chart-pie"],
    }
  },
  {
    path: "/dashboard",
    exact: false,
    name: "Dashboard",
    component: Dashboard
  },
  { path: "/accordion", exact: true, name: "Accordion", component: Accordion },
  { path: "/settings", exact: false, name: "Settings", component: Settings },
  { path: "/profile", exact: false, name: "Profile", component: Profile },

  { path: "*", name: "404 Page Not Found", component: ContentNotFound },
];

export default routes;
