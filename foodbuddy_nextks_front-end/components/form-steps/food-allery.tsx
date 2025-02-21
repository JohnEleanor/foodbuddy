
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"

const foodOptions = [
  "ถั่ว",
  "นม",
  "กลูเตน",
  "ไข่",
  "ถั่วเหลือง",
  "ไม่มี"
]
interface Foodallery {
  formData: any
  updateFormData: (data: any) => void
  errors: any
}
export function foodAllery({ formData, updateFormData, errors }: Foodallery) {
  
  const handleCheckboxChange = (option: string) => {
    const updatedPreferences = formData.foodallery.includes(option)
      ? formData.foodallery.filter((item: string) => item !== option)
      : [...formData.foodallery, option]
    updateFormData({ foodallery: updatedPreferences })
  }

  



  return (
    <div className="space-y-4">
      {foodOptions.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={option}
            checked={formData.foodallery.includes(option)}
            onCheckedChange={() => handleCheckboxChange(option)}
          />
          <Label htmlFor={option}>{option}</Label>
        </div>
      ))}
      <div>
        <Label htmlFor="other">อาหารที่เเพ้อื่นๆ</Label>
        <Textarea placeholder="ระบุรายการอาหารที่เเพ้อื่นๆ" onChange={(e) => updateFormData({ foodallery_other : e.target.value})} value={formData.foodallery_other || ""}/>
      </div>

      {errors.foodallery && (
        <p className="text-red-500 text-sm mt-1">{errors.foodallery}</p>
      )}
    </div>
  )
}

