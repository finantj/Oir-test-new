"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function TimelineSparkline({
  data,
}: {
  data: { year: number; count: number }[];
}) {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="year"
            tick={{ fill: "#e6d299", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            interval={5}
          />
          <YAxis hide domain={[0, "dataMax+2"]} />
          <Tooltip
            contentStyle={{ background: "#2f2418", border: "1px solid #d4b36b", color: "#e6d299" }}
          />
          <Line type="monotone" dataKey="count" stroke="#d4b36b" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
