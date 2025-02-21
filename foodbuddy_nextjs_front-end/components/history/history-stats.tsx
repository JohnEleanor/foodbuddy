"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Utensils, Cake, Popcorn } from "lucide-react";

import { useHistoryEat } from "@/context/HistoryEatContext";
import { useEffect } from "react";

interface HistoryStatsProps {
  totalItems?: number; // ทำให้ props เป็น optional
  savoryCount?: number;
  sweetCount?: number;
  snackCount?: number;
  totalCalories?: number;
}

export function HistoryStats({
  totalItems,
  savoryCount,
  sweetCount,
  snackCount,
  totalCalories,
}: HistoryStatsProps) {
  const context = useHistoryEat(); // ดึงค่าจาก Context

  useEffect(() => {
    console.log("Context updated:", context);
  }, [context]);

  // ตรวจสอบสถานะ loading
  const isLoading =
    context.totalItems === undefined ||
    context.savoryCount === undefined ||
    context.sweetCount === undefined ||
    context.snackCount === undefined ||
    context.totalCalories === undefined;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">รายการทั้งหมด</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems ?? context.totalItems}</div>
          <p className="text-xs text-muted-foreground">รายการ</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">ของคาว</CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savoryCount ?? context.savoryCount}</div>
          <p className="text-xs text-muted-foreground">รายการ</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">ของหวาน</CardTitle>
          <Cake className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sweetCount ?? context.sweetCount}</div>
          <p className="text-xs text-muted-foreground">รายการ</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">ของทานเล่น</CardTitle>
          <Popcorn className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{snackCount ?? context.snackCount}</div>
          <p className="text-xs text-muted-foreground">Kcal</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">แคลอรี่รวม</CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCalories ?? context.totalCalories}</div>
          <p className="text-xs text-muted-foreground">Kcal</p>
        </CardContent>
      </Card>
    </div>
  );
}
