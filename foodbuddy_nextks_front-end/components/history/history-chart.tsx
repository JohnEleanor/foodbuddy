"use client";

// import * as React from "react"
import { useMemo, useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"


import { useHistoryEat } from "@/context/HistoryEatContext"
import { toast } from "sonner"


const chartConfig = {
  calories: {
    label: "Calories",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


interface FoodItem {
  time: string;
  food_name: string;
  calories: number;
  category: string;
}

interface TransformedData {
  date: string;
  calories: number;
  food: FoodItem[];
}

interface RawDataItem {
  eaten_at: string;
  food_name: string;
  calories: number;
  category: string;
}




export function ChartTest({ Data }: any) {

  const { monthSelected ,setData, setMonthSelected, setTotalCalories, setSavoryCount, setSweetCount, setTotalItems, setSnackCount } = useHistoryEat();
  const { totalCalories, savoryCount, sweetCount, totalItems, snackCount } = useHistoryEat();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [chartData , setChartData] = useState<TransformedData[]>([]);

  function transformFoodData(data: RawDataItem[]): TransformedData[] {
    return Object.values(
      data.reduce((acc: { [key: string]: TransformedData }, item: RawDataItem) => {
        const date = new Date(item.eaten_at).toISOString().split("T")[0]; // แปลงวันที่เป็น YYYY-MM-DD
        const time = new Date(item.eaten_at).toISOString().split("T")[1].substring(0, 5); // แปลงเวลาเป็น HH:mm
  
        if (!acc[date]) {
          acc[date] = { date, calories: 0, food: [] };
        }
  
        acc[date].calories += item.calories;
        acc[date].food.push({
          time,
          food_name: item.food_name,
          calories: item.calories,
          category: item.category,
        });
  
        return acc;
      }, {})
    );
  }

  const filteredData = useMemo(() => {
    const monthStart = new Date(`2025-${selectedMonth.padStart(2, '0')}-01`)
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
    return chartData.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= monthStart && itemDate <= monthEnd
    })
  }, [selectedMonth])
  
  const totalCalorie = useMemo(() => 
    filteredData.reduce((acc, curr) => acc + curr.calories, 0),
    [filteredData]
  )

  const averageCalories = useMemo(() => 
    Math.round(totalCalorie / filteredData.length),
    [totalCalorie, filteredData]
  )


  const handleBarClick = async (data: any) => {
    if (data && data.activePayload) {
      const myData = data.activePayload[0].payload;

      await toast.promise(
        new Promise((resolve) => {
          // Mocking a process, replace this with your actual logic
          setTimeout(() => {
            setData(myData);
            resolve("เลือกข้อมูลเรียบร้อย");
            // const todayItems: any = [];
            let totalCalories = 0;
            let savoryCount = 0;
            let sweetCount = 0;
            let totalItems = 0;
            let snackCount = 0;
            // const currentDate = new Date();
            const dataFood = myData.food;
            dataFood.forEach((item: any) => {
         
              if (item.category === "อาหารคาว") {
                savoryCount++;
              } else if (item.category === "อาหารหวาน") {
                sweetCount++;
              } else if (item.category === "ของทานเล่น") {
                snackCount++;
              }
              totalCalories += item.calories;
              totalItems++;

          
              console.log("Chart -> stat",totalItems, savoryCount, sweetCount, snackCount, totalCalories);
            });
            setSnackCount(snackCount);
            setTotalCalories(totalCalories);
            setSavoryCount(savoryCount);
            setSweetCount(sweetCount);
            setTotalItems(totalItems);
            // });
          }, 500); // ตัวอย่างดีเลย์ 1 วินาที
        }),
        {
          loading: "กำลังเลือกข้อมูล...",
          success: "เลือกข้อมูลเรียบร้อย",
          error: "เกิดข้อผิดพลาดในการเลือกข้อมูล",
        }
      );
    }
  };

  // useEffect(() => {
  
  // }, [Data, totalItems, savoryCount, sweetCount, snackCount, totalCalories])


  return (

      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>แผนภูมิการบริโภคแคลอรี่</CardTitle>
              <CardDescription>
              แสดงการบริโภคแคลอรี่รายวันสำหรับเดือนที่เลือก
              </CardDescription>
          </div>
          <div className="flex items-center px-6 py-4 sm:px-8">
            
              <Select value={selectedMonth} onValueChange={((value) => {
                setSelectedMonth(value) 
                setMonthSelected(value)
                const transformedData = transformFoodData(Data);
                setChartData(transformedData);  
              } )}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="กรุณาเลือกเดือน" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* <SelectLabel>เลือกเดือนที่ คุณต้องการ</SelectLabel> */}
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {new Date(2024, month - 1).toLocaleString('th-TH', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-muted p-4">
              <span className="text-sm text-muted-foreground">แคลอรี่ทั้งหมด</span>
              {totalCalories !== 0? (<p className="text-2xl font-bold">{totalCalories.toLocaleString()}</p>) : (<p className="text-2xl font-bold">ไม่มีข้อมูล</p>)}
            </div>
            <div className="rounded-lg bg-muted p-4">
              <span className="text-sm text-muted-foreground">แคลอรี่เฉลี่ยต่อวัน</span>
              {!Number.isNaN(averageCalories) ? (<p className="text-2xl font-bold">{averageCalories.toLocaleString()}</p>) : (<p className="text-2xl font-bold">ไม่มีข้อมูล</p>)}
            </div>
          </div>
          {/* {chartData.length} */}
          {chartData.length == 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              กรุณาเลือก "เดือน" เพื่อแสดงรายการ
            </div>
          ) : (
            <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart

              data={filteredData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
              onClick={handleBarClick}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("th-TH", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="calories"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("th-TH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />

              <Bar dataKey="calories" fill={`var(--color-calories)`} radius={8} />
            </BarChart>
            </ChartContainer>
          )}
          
          
        </CardContent>
        {chartData.length !== 0 && (
          <CardFooter className="flex items-center justify-center text-sm text-center">
            <div ><p>คลิกเพื่อเเสดงข้อมูลในตารางด้านล่าง</p></div>
          </CardFooter>
        )}
      </Card>
  )
}

