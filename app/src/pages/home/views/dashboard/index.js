import React from "react";

import { Card, CardHeader, CardBody } from "../../../../components/card";
import ChartCard from "../../../../components/chart-card";

import "./index.scss";

function Dashboard() {
  const postsData = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];
  const pagesData = [
    { name: "Page A", uv: 8, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 16, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 24, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 25, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 31, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 47, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 60, pv: 4300, amt: 2100 },
  ];
  const commentsData = [
    { name: "Page A", uv: 2000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3200, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 1200, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2400, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 500, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 700, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 1375, pv: 4300, amt: 2100 },
  ];
  const newCustomersData = [
    { name: "Page A", uv: 70, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 120, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 48, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 12, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 56, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 90, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 89, pv: 4300, amt: 2100 },
  ];
  return (
    <div className="dashboard-view-container">
      <div className="dashboard-view-child-25">
        <Card>
          <CardBody className="p-0">
            <ChartCard title="POSTS" data={postsData} dataKey="uv" height={200} color="#ff4757" showCurrent />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-0">
            <ChartCard title="PAGES" data={pagesData} dataKey="uv" height={200} color="#1e90ff" showCurrent />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-0">
            <ChartCard title="COMMENTS" data={commentsData} dataKey="uv" height={200} color="#2ed573" showCurrent />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-0">
            <ChartCard title="NEW CUSTOMERS" data={newCustomersData} dataKey="uv" height={200} color="#ffa502" showCurrent />
          </CardBody>
        </Card>
      </div>
      <div className="dashboard-view-child-50">
        <Card>
          <CardHeader>
            <h6>DASHBOARD</h6>
          </CardHeader>
          <CardBody>body</CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h6>DASHBOARD</h6>
          </CardHeader>
          <CardBody>body</CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
