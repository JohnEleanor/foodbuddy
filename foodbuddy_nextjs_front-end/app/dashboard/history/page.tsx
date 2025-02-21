"use client";
import { HistoryEat } from "@/components/history/history-table";
import { HistoryStats } from "@/components/history/history-stats";
import { ChartTest } from "@/components/history/history-chart";
import { useHistoryEat } from "@/context/HistoryEatContext";

import { useState, useEffect } from "react";

export default function Page() {
  const {  snackCount, totalCalories, savoryCount, sweetCount, totalItems } = useHistoryEat();
  const [userHistoryData, setUserHistory] = useState<any>([]);
  const { setTotalCalories, setSavoryCount, setSweetCount, setSnackCount, setTotalItems } = useHistoryEat();


  const loadData = async () => {
    const _userData = localStorage.getItem("Jay:userData");
    if (_userData) {
      const userData_ = JSON.parse(_userData);
      const userId = userData_.userId;
      const response = await fetch(`/api/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_lineId: userId }),
      });
      const data = await response.json();
      const result = data.result;
      // console.log("result",result);

      let totalCalories = 0;
      let savoryCount = 0;
      let sweetCount = 0;
      let totalItems = 0;
      let snackCount = 0;
      result.forEach((item: any) => {
        if (item.category === "อาหารคาว") {
          savoryCount++;
        } else if (item.category === "อาหารหวาน") {
          sweetCount++;
        } else if (item.category === "ของทานเล่น") {
          snackCount++;
        }
        totalCalories += item.calories;
        if (item.food_name !== null) {
          totalItems++;
        }
      });

      setTotalCalories(totalCalories);
      setSavoryCount(savoryCount);
      setSweetCount(sweetCount);
      setTotalItems(totalItems);
      setSnackCount(snackCount);

      setUserHistory(result);
    }
     
  };

  // ใช้ useEffect เพื่อตรวจสอบเมื่อ monthSelected เปลี่ยน
  useEffect(() => {
    loadData();
  }, []); // ไม่ต้องใส่ totalCalories, savoryCount, sweetCount, totalItems ใน dependency
  return (
    <>

      <div className="text-2xl ">ประวัติการกิน </div>
      <div className="mb-4"> การเเสดงข้อมูลใน Stat รอบเเรกจะเป็นการเเสดงข้อมูลทั้งหมด</div>
      <div className="max-h-fit flex-1 rounded-xl  md:min-h-min overflow-x-auto">
        <HistoryStats
          totalCalories={totalCalories}
          savoryCount={savoryCount}
          sweetCount={sweetCount}
          totalItems={totalItems}
          snackCount={snackCount} 
        />
      </div>
      <div className="max-h-fit flex-1 rounded-xl  md:min-h-min  overflow-x-auto">
        <ChartTest Data={userHistoryData} />
      </div>
      <div className="max-h-fit flex-1 rounded-xl border  md:min-h-min p-4  overflow-x-auto">
        <HistoryEat />
      </div>
    </>
  );
}
