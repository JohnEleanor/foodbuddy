"use client";
import { CaltoDay } from "@/components/dashboard/calories-to-day";
import { Nutrients } from "@/components/dashboard/nutrients";
import { HistoryEat } from "@/components/dashboard/history-eat";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import dynamic from 'next/dynamic'

// const CaltoDay = dynamic(() => import('@/components/dashboard/calories-to-day'))

interface HistoryItem {
  user_dailycalories: number;
  calories: number;
  fat: number;
  protein: number;
  carbohydrates: number;
  eaten_at: string;
}

export default function Page() {
  const [userData, setData] = useState<HistoryItem[] | null>(null); // กำหนดโครงสร้างของข้อมูล
  const [loading, setLoading] = useState(true);
  const [dailyCalories, setDailyCalories] = useState<number>(0);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [carbohydrates, setCarbohydrates] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);

  const loadData = async () => {
    try {
      const _userData = localStorage.getItem("Jay:userData");
      if (_userData) {
        const userData = JSON.parse(_userData);
        const response = await fetch(`/api/history/${userData.userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const result: HistoryItem[] = data.result;

        // คำนวณ totalCalories
        const totalCalories = result.reduce((sum, item) => sum + item.calories, 0);
        const totalFat = result.reduce((sum, item) => sum + item.fat, 0);
        const totalCarbohydrates = result.reduce((sum, item) => sum + item.carbohydrates, 0);
        const totalProtein = result.reduce((sum, item) => sum + item.protein, 0);
        const dailyCalories = result[0].user_dailycalories || 2000; // กำหนดค่าดีฟอลต์

        setFat(totalFat);
        setCarbohydrates(totalCarbohydrates);
        setProtein(totalProtein);
        setTotalCalories(totalCalories);
        setDailyCalories(dailyCalories);
        setData(result);
      } else {
        console.log("No user data found");
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // console.log(userData)
  }, []);

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div>
          {loading ? (
            <div className="border p-4 rounded-lg">
              <Skeleton className="w-full h-[38.6vh]" />
            </div>
          ) : (
            <CaltoDay
              maxCalories={dailyCalories}
              currentCalories={totalCalories}
            />
          )}
        </div>
        <div className="col-span-1 lg:col-span-2 md:col-span-2">
          {loading ? (
            <div className="border p-4 rounded-lg">
              <Skeleton className="w-full h-[38.6vh]" />
            </div>) : (<Nutrients carbohydrates={carbohydrates} protein={protein} fat={fat} />)}
          
        </div>
      </div>

      <div className="min-h-max flex-1 rounded-lg border md:min-h-min p-4 overflow-x-auto">
        {loading ? (
          <Skeleton className="h-[200px] w-full rounded-lg" />
        ) : (
          <HistoryEat data={userData} /> 
        )}
      </div>
    </>
  );
}
