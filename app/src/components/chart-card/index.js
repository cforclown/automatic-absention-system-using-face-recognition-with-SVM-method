import React from "react";
import PropTypes from "prop-types";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

import "./index.scss";

function ChartCard({ title, data, dataKey, width, height, color, showCurrent }) {
    function numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div className="cl-chart-card">
            <ResponsiveContainer width={width} height={height}>
                <AreaChart
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} />
                </AreaChart>
            </ResponsiveContainer>
            <div className="cl-chart-card-title">{title}</div>
            {showCurrent ? <div className="cl-chart-card-value">{numberWithCommas(data[data.length - 1][dataKey])}</div> : null}
        </div>
    );
}
ChartCard.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    dataKey: PropTypes.string.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string,
    showCurrent: PropTypes.bool,
};
ChartCard.defaultProps = {
    showCurrent: false,
    width: "100%",
    height: "100%",
    color: "#f53b57",
};

export default ChartCard;
