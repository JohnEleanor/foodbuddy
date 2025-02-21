import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { error } from "console";

interface PersonalInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  errors: any;
}

export function PersonalInfoStep({ formData, updateFormData, errors }: PersonalInfoStepProps) {
  const [bmi, setBmi] = useState(0);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const calculatedAge = calculateAge(date); // คำนวณอายุจากวันเกิด
      updateFormData({ dateOfBirth: date, age: calculatedAge }); // อัพเดทข้อมูลวันเกิดและอายุ
    }
  };

  // ฟังก์ชันคำนวณอายุ
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // คำนวณ BMI
  const calculateBmi = (weight: number, height: number): number => {
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const cal_bmi = weight / (heightInMeters * heightInMeters)
      // console.log(cal_bmi)
      updateFormData({ bmi: parseFloat(cal_bmi.toFixed(2)) });
      return weight / (heightInMeters * heightInMeters);
    }
    return 0;
  };

  useEffect(() => {
    const updatedBmi = calculateBmi(formData.weight, formData.height);
    setBmi(updatedBmi);
  }, [formData.weight, formData.height]);

  return (
    <div className="space-y-4">
      <div>
        <Label >ชื่อ</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="กรุณาใส่ชื่อของคุณ"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label >วันเกิด</Label>
        <div className="flex flex-col">
          <DatePicker onChange={handleDateChange} />
        </div>
        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
      </div>

      <div>
        <Label >อายุ</Label>
        <Input
          id="age"
          type="number"
          value={formData.age}
          disabled={true}
          placeholder="กรุณาใส่อายุของคุณ"
        />
        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
      </div>

      <div>
        <Label >น้ำหนัก</Label>
        <Input
          id="weight"
          type="number"
          value={formData.weight}
          onChange={(e) => updateFormData({ weight: parseFloat(e.target.value) })}
          placeholder="กรุณาใส่น้ำหนักของคุณ"
        />
        {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
      </div>

      <div>
        <Label htmlFor="height">ส่วนสูง</Label>
        <Input
          id="height"
          type="number"
          value={formData.height}
          onChange={(e) => updateFormData({ height: parseFloat(e.target.value) })}
          placeholder="กรุณาใส่ส่วนสูงของคุณ"
        />
        {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
      </div>
      <div>
        <Label >เพศ</Label>
        <Select onValueChange={(value) => updateFormData({gender : value})} value={formData.gender}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="กรุณาเลือกเพศ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">ชาย</SelectItem>
            <SelectItem value="female">หญิง</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
      </div>

      <div>
        <Alert>
          <AlertDescription>
            ค่า BMI ของคุณคือ :{" "}
            <Badge>
              {bmi.toFixed(2)} {/* แสดง BMI ที่คำนวณ */}
            </Badge>
            <Input
              type="number"
              value={formData.bmi}
              className="hidden"
              onChange={(e) => updateFormData({ bmi: parseFloat(e.target.value) })}
              readOnly
            />
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
