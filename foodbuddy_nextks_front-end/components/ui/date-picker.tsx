"use client"

import * as React from "react"
import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface DatePickerProps {
  startYear?: number;
  endYear?: number;
  onChange?: (date: Date) => void; // เพิ่ม `onChange` เป็น Prop
}

// ฟังก์ชันแปลงจาก ค.ศ. เป็น พ.ศ.
const toBuddhistYear = (year: number) => year + 543;

export function DatePicker({
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()),
  onChange, // รับ `onChange` จาก Props
}: DatePickerProps) {

  const [date, setDate] = React.useState<Date>(new Date());

  const months = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => toBuddhistYear(startYear + i)
  );

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
    onChange?.(newDate); // เรียก `onChange` เมื่อเดือนเปลี่ยน
  }

  const handleYearChange = (year: string) => {
    const newDate = setYear(date, parseInt(year) - 543);  // แปลง พ.ศ. กลับเป็น ค.ศ.
    setDate(newDate);
    onChange?.(newDate); // เรียก `onChange` เมื่อปีเปลี่ยน
  }

  const handleSelect = (selectedData: Date | undefined) => {
    if (selectedData) {
      setDate(selectedData);
      onChange?.(selectedData); // เรียก `onChange` เมื่อวันที่ถูกเลือก
    }
  }

  return (

    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[250px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "P") : <span>เลือกวันที่</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(date)]}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="เดือน" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={toBuddhistYear(getYear(date)).toString()}  // แสดงปีในรูปแบบ พ.ศ.
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="ปี" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          month={date}
          onMonthChange={setDate}
        />
      </PopoverContent>
    </Popover>

  )
}
