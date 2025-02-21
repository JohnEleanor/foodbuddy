"use client"
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"
import { Separator } from "@/components/ui/separator"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  views : {
    label : "กรัม/วัน",
  },
  move: {
    label: "ไขมัน",
    color: "hsl(var(--chart-1))",
  },
  stand: {
    label: "โปรตีน",
    color: "hsl(var(--chart-2))",
  },
  exercise: {
    label: "คาร์โบไฮเดต",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig



interface NutrientsProps {
  carbohydrates: number;
  protein: number;
  fat: number;
}

export function Nutrients({carbohydrates, protein, fat}: NutrientsProps) {
  const chartData = [
    {
      activity: "stand",
      cal: protein,
      label: "",
      fill: "var(--color-stand)",
    },
    {
      activity: "exercise",
      cal: carbohydrates,
      label: "",
      fill: "var(--color-exercise)",
    },
    {
      activity: "move",
      cal: fat,
      label: "",
      fill: "var(--color-move)",
    },
  ]
  return (
    <>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">สารอาหารวันนี้</CardTitle>
          </CardHeader>
            <CardContent className="flex gap-4 p-4 pb-2">
              <ChartContainer
                config={chartConfig}
                className="h-[140px] w-full"
              >
                <BarChart
                  margin={{
                    left: 10,
                    right: 0,
                    top: 0,
                    bottom: 10,
                  }}
                  data={chartData}
                  layout="vertical"
                  barSize={30}
                  barGap={2}
                >
                  
                   <YAxis
                    dataKey="activity"
                    type="category"
                    tickLine={false}
                    tickMargin={1}
                    axisLine={false}
                    className="capitalize"
                    tickFormatter={(value) =>
                      chartConfig[value as keyof typeof chartConfig]?.label
                    }
                  />
                 
                  <XAxis type="number" dataKey="cal" hide  />
                  <ChartTooltip
                    cursor={false}
                    content={
                    <ChartTooltipContent  
                      indicator="line"
                      nameKey="views"
                      />
                    }
                  />
                  
                 

                  <Bar dataKey="cal" radius={5}>
                    <LabelList
                      position="insideLeft"
                      dataKey="label"
                      fill="white"
                      offset={8}
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-row border-tborder-t p-4">
              <div className="flex w-full items-center gap-2">
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-xs text-muted-foreground">ไขมัน</div>
                  <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                    {fat ? fat : (<>ไม่พบข้อมูล</>)}
                    <span className="text-sm font-normal text-muted-foreground">
                      กรัม
                    </span>
                  </div>
                </div>
                <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-xs text-muted-foreground">คาร์โบไฮเดต</div>
                  <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                    {carbohydrates ? carbohydrates : (<>ไม่พบข้อมูล</>)}
                    <span className="text-sm font-normal text-muted-foreground">
                    กรัม
                    </span>
                  </div>
                </div>
                <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-xs text-muted-foreground">โปรตีน</div>
                  <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                    {protein ? protein : (<>ไม่พบข้อมูล</>)}
                    <span className="text-sm font-normal text-muted-foreground">
                    กรัม
                    </span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
    </>
  )
}
