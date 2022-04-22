const content = [
  {
    title: "Dashboard",
    pathname: "/dashboard",
    icon: ["fas", "chart-pie"],
  },
  {
    title: "Students",
    pathname: "/students",
    icon: ["fas", "users"],
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
      {
        title: "Users",
        pathname: "/master-data/users",
        icon: ["fas", "users-cog"],
        permission: {
          masterData: 'view'
        }
      },
      {
        title: "Roles",
        pathname: "/master-data/roles",
        icon: ["fas", "exclamation-circle"],
        permission: {
          masterData: 'view'
        }
      },
    ]
  },
];

export default content;
