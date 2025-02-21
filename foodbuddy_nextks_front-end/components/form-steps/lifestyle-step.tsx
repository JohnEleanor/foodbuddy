import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const lifestyleOptions = [
  {
    value: "sedentary",
    label: "ไม่ออกกำลังกาย / ทำงานนั่งโต๊ะ",
    icon: "👤",
  },
  {
    value: "light",
    label: "ออกกำลังกายเบาๆ",
    sublabel: "(3-5 ครั้งต่อสัปดาห์)",
    icon: "💪",
  },
  {
    value: "moderate",
    label: "ออกกำลังกาย",
    sublabel: "(3-5 ครั้งต่อสัปดาห์)",
    icon: "🏃",
  },
  {
    value: "active",
    label: "ออกกำลังกายเป็นประจำ",
    sublabel: "(6-7 ครั้งต่อสัปดาห์)",
    icon: "🏋️",
  },
  {
    value: "intense",
    label: "ออกกำลังกายหนัก",
    sublabel: "(วันละ 2 ช่วง)",
    icon: "💪",
  },
]
interface TargetStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  errors: any;
}


export function LifestyleStep({ formData, updateFormData, errors } : TargetStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-6">คุณมีไลฟ์สไตล์แบบใด</h2>
      <p className="text-sm text-muted-foreground mb-6">
        กรุณากรอกข้อมูลของคุณเพื่อนำไปคำนวณและปรับปรุงสุขภาพของคุณ
      </p>
      <RadioGroup
        value={formData.lifestyle || ""}
        onValueChange={(value) => updateFormData({ lifestyle: value })}
        className="space-y-3"
      >
        {lifestyleOptions.map((option) => (
          <Label
            key={option.value}
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              formData.lifestyle === option.value
                ? "border-lime-500 bg-lime-500 text-white"
                : "border-border hover:border-lime-500/50"
            }`}
          >
            <RadioGroupItem value={option.value} className="sr-only" />
            <span className="text-2xl rounded-full bg-primary p-2">{option.icon}</span>
            <div className="flex-1">
              <p className="font-medium">{option.label}</p>
              {option.sublabel && (
                <p className="text-sm text-muted-foreground">{option.sublabel}</p>
              )}
            </div>
          </Label>
        ))}
      </RadioGroup>
      {errors.lifestyle && (
        <p className="text-red-500 text-sm mt-2">{errors.lifestyle}</p>
      )}
    </div>
  )
}

