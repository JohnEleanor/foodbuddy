"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TrendingUp } from 'lucide-react'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


export function CaltoDay({ maxCalories, currentCalories }: { maxCalories: number; currentCalories: number }) {
  const percentage = Math.min((currentCalories / maxCalories) * 100, 100);
  const chartData = [
    { calories: currentCalories, percentage, fill: "var(--color-safari)" },
  ];
  return (
    <>
      <Card className="max-w-full md:max-w-lg lg:max-w-xl h-full rounded-lg">
     
        <CardContent className="py-8">
        <ChartContainer
          config={chartConfig}
          className="mx-auto  max-h-[180px] w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={(currentCalories / maxCalories) * 360}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="percentage" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {currentCalories}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 30}
                          className="fill-muted-foreground"
                        >
                          กิโลแคลอรี่
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
        </CardContent>
        <CardFooter className="w-full">
          <div className="flex w-full justify-center items-center  pt-2">
            <div className="flex w-full items-center  ">
              <div className="grid flex-1">
                <div className="text-xs text-muted-foreground">เคลอรี่วันนี้</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  {currentCalories}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {maxCalories}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardFooter>
        
      </Card>
    </>
  );
}

