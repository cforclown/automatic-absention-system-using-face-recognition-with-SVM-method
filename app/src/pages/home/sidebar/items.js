const content = [
  {
    title: "Dashboard",
    pathname: "/dashboard",
    icon: ["fas", "chart-pie"],
  },
  {
    title: "Attendence",
    pathname: "/attendence",
    icon: ["fas", "exclamation-circle"],
  },
  {
    title: "Attendence",
    pathname: "/attendence",
    icon: ["fas", "exclamation-circle"],
    permission: {
      data: 'view'
    }
  },
  {
    divider: true,
  },
  {
    title: "Master Data",
    pathname: "/master-data",
    icon: ["fas", "database"],
    items: [

    ]
  },
];

export default content;
