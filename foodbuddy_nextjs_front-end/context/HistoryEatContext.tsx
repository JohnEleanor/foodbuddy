import { createContext, useState, useContext } from "react";

const HistoryData = createContext<any>(undefined);

export function HistoryEatProvider({ children }: { children: React.ReactNode }) {
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [savoryCount, setSavoryCount] = useState<number>(0);
  const [sweetCount, setSweetCount] = useState<number>(0);
  const [snackCount, setSnackCount] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [data, setData] = useState<any>(null);
  const [monthSelected, setMonthSelected] = useState<string>("1");


  return (
    <HistoryData.Provider
      value={{
        data,
        setData,
        monthSelected,
        setMonthSelected,
        totalCalories,
        setTotalCalories,
        savoryCount,
        setSavoryCount,
        sweetCount,
        setSweetCount,
        totalItems,
        setTotalItems,
        snackCount,
        setSnackCount,
      }}
    >
      {children}
    </HistoryData.Provider>
  );
}

export function useHistoryEat() {
  const context = useContext(HistoryData);
  if (!context) {
    throw new Error("useHistoryEat must be used within a HistoryEatProvider");
  }
  return context;
}
