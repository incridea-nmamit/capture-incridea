"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"
import { api } from "~/utils/api" 


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  download: {
    label: "Download Logs",
    color: "hsl(var(--chart-1))",
  },
  story: {
    label: "Story Logs",
    color: "hsl(var(--chart-2))",
  },
  playback: {
    label: "Playback Logs",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

/**
 * LogChartComponent
 * Visualizes log data using a pie chart with dynamic data updates
 */
export function LogChartComponent() {
  // Data fetching hooks
  const { data: downloadLogs = [] } = api.download.getAllDownloadLogs.useQuery()
  const { data: playbackLogs = [] } = api.playbacks.getAllPlayBackLogs.useQuery()

  // Compute chart data
  const logData = React.useMemo(() => {
    return [
      { browser: "Download Logs", visitors: downloadLogs.length, fill: "blue" },
      { browser: "Playback Logs", visitors: playbackLogs.length, fill: "var(--color-firefox)" },
    ]
  }, [downloadLogs, playbackLogs])

  // Calculate the total number of visitors (logs)
  const totalLogs = React.useMemo(() => {
    return logData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [logData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Logs </CardTitle>
        <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={logData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalLogs.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Logs
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by {totalLogs} this time <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing log data for the latest Downloads
        </div>
      </CardFooter>
    </Card>
  )
}
