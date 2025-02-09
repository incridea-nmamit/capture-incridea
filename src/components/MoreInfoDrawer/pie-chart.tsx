"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart as RechartsPieChart } from "recharts"

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

/**
 * Props interface for CustomPieChart
 */
type Props = {
    totalDownloads: number;    // Total number of downloads
    totalLikes: number;        // Total number of likes
}

/**
 * CustomPieChart Component
 * Displays a pie chart comparing downloads and likes
 * Features interactive tooltips and animated transitions
 */
export function CustomPieChart({
    totalDownloads,
    totalLikes
}: Props) {
    // Chart data configuration
    const chartData = [
        { browser: "downloads", visitors: totalDownloads, fill: "blue" },
        { browser: "likes", visitors: totalLikes, fill: "red" },
    ]

    // Calculate total for center label
    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [totalDownloads, totalLikes])

    return (
        <Card className="flex flex-col bg-gradient-to-tl from-neutral-900 to-black">
            {/* Chart Header */}
            <CardHeader className="items-center pb-0">
                <CardTitle className="font-">Pie Chart - Likes/Downloades</CardTitle>
                <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>

            {/* Chart Content */}
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={{
                        downloads: {
                            label: "Downloads",
                            color: "hsl(var(--chart-1))",
                        },
                        likes: {
                            label: "Likes",
                            color: "hsl(var(--chart-2))",
                        },
                    }}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RechartsPieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
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
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </RechartsPieChart>
                </ChartContainer>
            </CardContent>

            {/* Chart Footer */}
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by {totalDownloads+totalLikes} now <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing latest total downloads and likes 
                </div>
            </CardFooter>
        </Card>
    )
}
