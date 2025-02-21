"use client"

import React, { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useHistoryEat } from "@/context/HistoryEatContext"
import { Skeleton } from "@/components/ui/skeleton"

export function HistoryEat({ myData }: any) {
  const { data } = useHistoryEat()
  const [loading, setLoading] = useState(false)
  const [displayData, setDisplayData] = useState<any[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "อาหารคาว" | "อาหารหวาน" | "ของกินเล่น">("all")

  useEffect(() => {
    if (data) {
      setLoading(true)
      const foodData = data.food.map((item: any) => ({
        time: item.time,
        type: item.category,
        calories: item.calories.toString(),
        food_name: item.food_name,
      }))
      
      setTimeout(() => {
        setDisplayData(foodData)
        setLoading(false)
      }, 500)
    } else {
      setDisplayData([])
      setLoading(false)
    }
  }, [data])

  const filteredInvoices = displayData.filter((food) =>
    (filterType === "all" || food.type === filterType) &&
    (food.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.calories.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <div className="text-xl font-bold">ประวัติการกิน</div>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search">ค้นหา</Label>
          <Input
            id="search"
            type="text"
            placeholder="ค้นหาประวัติการกิน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px]">
          <Label htmlFor="filter-type">ประเภทอาหาร</Label>
          <Select
            value={filterType}
            onValueChange={(value: "all" | "อาหารคาว" | "อาหารหวาน" | "ของกินเล่น") => setFilterType(value)}
          >
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="เลือกประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="อาหารคาว">อาหารคาว</SelectItem>
              <SelectItem value="อาหารหวาน">อาหารหวาน</SelectItem>
              <SelectItem value="ของกินเล่น">ของกินเล่น</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableCaption>ประวัติการกินอาหารของคุณ</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5 font-bold text-primary">เวลา</TableHead>
            <TableHead className="font-bold text-primary">ชื่อเมนู</TableHead>
            <TableHead className="font-bold text-primary">ประเภท</TableHead>
            <TableHead className="text-right font-bold text-primary">จำนวนเเคลอรี่</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[10px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              </TableRow>
            ))
          ) : filteredInvoices.length > 0 ? (
            filteredInvoices.map((food, index) => (
              <TableRow key={`${food.time}-${index}`}>
                <TableCell className="">{food.time}</TableCell>
                <TableCell>{food.food_name}</TableCell>
                <TableCell>{food.type}</TableCell>
                <TableCell className="text-right">{food.calories} Kcal</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">ไม่มีข้อมูล กรุณาคลิกเพื่อเเสดงข้อมูล</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {loading ? (
                <Skeleton className="h-4 w-[80px] ml-auto" />
              ) : filteredInvoices.length > 0 ? (
                `${filteredInvoices.reduce((total, food) => total + parseFloat(food.calories), 0).toFixed(2)} kcal`
              ) : (
                "0 kcal"
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

