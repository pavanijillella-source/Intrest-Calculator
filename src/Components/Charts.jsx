import React from "react";
import {
  PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, currency }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "#16161f", border: "1px solid #c9a84c",
        borderRadius: 8, padding: "10px 16px",
        color: "#ffffff", fontSize: 13,
      }}>
        <div style={{ color: "#7c6ff7", marginBottom: 4 }}>{payload[0]?.payload?.year}</div>
        <div>{currency}{Number(payload[0]?.value).toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

export default function Charts({ result, yearlyData, currency }) {
  const pieData = [
    { name: "Principal", value: result.principal },
    { name: "Interest", value: result.interest ?? result.totalInterest },
  ];

  return (
    <div className="charts-row">
      {/* Pie Chart */}
      <div className="chart-panel">
        <div className="chart-title">ALLOCATION BREAKDOWN</div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
              <Cell fill="#7c6ff7" />
              <Cell fill="#34d399" />
            </Pie>
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div style={{
                    background: "#16161f", border: "1px solid #c9a84c",
                    borderRadius: 6, padding: "8px 12px",
                    color: "#ffffff", fontSize: 12,
                  }}>
                    <div>{payload[0].name}</div>
                    <div style={{ color: "#7c6ff7" }}>{currency}{Number(payload[0].value).toLocaleString()}</div>
                  </div>
                ) : null
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="legend">
          <span><span className="dot gold-dot" />Principal</span>
          <span><span className="dot green-dot" />Interest</span>
        </div>
      </div>

      {/* Area Chart */}
      <div className="chart-panel grow">
        <div className="chart-title">GROWTH TRAJECTORY</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={yearlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c6ff7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7c6ff7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "#6b6b6b", fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => `${currency}${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Area
              type="monotone" dataKey="amount"
              stroke="#7c6ff7" strokeWidth={2}
              fill="url(#areaGrad)" dot={false}
              activeDot={{ r: 5, fill: "#c9a84c", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}