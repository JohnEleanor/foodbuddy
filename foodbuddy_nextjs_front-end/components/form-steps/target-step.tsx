import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


const target = [
  {
    value: "รักษาน้ำหนัก",
    label: "ฉันต้องการรักษาน้ำหนักเท่าเดิม",
    icon: "💪",
  },
  {
    value: "เพิ่มน้ำหนัก",
    label: "ฉันต้องการเพิ่มน้ำหนัก",
    icon: "💪",
  },
  {
    value: "ลดน้ำหนัก",
    label: "ฉันต้องการลดน้ำหนัก",
    icon: "💪",
  },

 
]

interface TargetStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  errors: any;
}

export function targetStep({formData, updateFormData, errors}: TargetStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-6">เป้าหมายของคุณ</h2>
      <p className="text-sm text-muted-foreground mb-6">
        กรุณากรอกข้อมูลของคุณเพื่อนำไปคำนวณและปรับปรุงสุขภาพของคุณ
      </p>
      <RadioGroup
        value={formData.target || ""}
        onValueChange={(value) => updateFormData({ target: value })}
        className="space-y-3"
      >
        {target.map((option) => (
          <Label
            key={option.value}
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              formData.target === option.value
                ? "border-lime-500 bg-lime-500 text-white"
                : "border-border hover:border-lime-500/50"
            }`}
          >
          <RadioGroupItem value={option.value} className="sr-only" />
            <span className="text-2xl rounded-full bg-primary p-2">{option.icon}</span>
            <div className="flex-1">
              <p className="font-medium">{option.label}</p>
             
            </div>
          </Label>
        ))}
      </RadioGroup>
      {errors.target && (
        <p className="text-red-500 text-sm mt-2">{errors.target}</p>
      )}
    </div>
  )
}
