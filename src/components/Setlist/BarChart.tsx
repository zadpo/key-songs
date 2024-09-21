"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtendedSong } from "@/types";

export function SongChart({ songs }: { songs: ExtendedSong[] }) {
  const [activeChart, setActiveChart] = React.useState<"worshipLeaders" | "keys">("worshipLeaders");

  const chartData = React.useMemo(() => {
    return songs.map((song) => ({
      title: song.title,
      worshipLeaders: song.worshipLeaders.length,
      keys: song.keys.length,
    }));
  }, [songs]);

  const total = React.useMemo(
    () => ({
      worshipLeaders: songs.reduce((acc, curr) => acc + curr.worshipLeaders.length, 0),
      keys: songs.reduce((acc, curr) => acc + curr.keys.length, 0),
    }),
    [songs]
  );

  if (chartData.length === 0) {
    return <div>No song data available for chart</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Song Statistics</CardTitle>
          <CardDescription>Showing worship leaders and keys for each song</CardDescription>
        </div>
        <div className="flex">
          {["worshipLeaders", "keys"].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key as "worshipLeaders" | "keys")}
            >
              <span className="text-xs text-muted-foreground">
                {key === "worshipLeaders" ? "Worship Leaders" : "Keys"}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total[key as keyof typeof total].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="id"
                axisLine={false}
                tickLine={false}
                tick={{ textAnchor: "end", fontSize: 12 }}
                height={60}
                interval={0}
              />
              <Tooltip />
              <Bar
                dataKey={activeChart}
                fill={activeChart === "worshipLeaders" ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
