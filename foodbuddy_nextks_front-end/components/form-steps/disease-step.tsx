import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const dietaryOptions = [
  "เบาหวาน",
  "ความดันโลหิต",
  "โรคหัวใจ",
  "โรคอ้วน",
  "คลอเลสเตอรอลสูง",
  "ไม่มี"
]
interface DiseaseStep {
  formData: any
  updateFormData: (data: any) => void
  errors: any
}
export function DiseaseStep({ formData, updateFormData, errors }: DiseaseStep) {
  
  const handleCheckboxChange = (option: string) => {
    const updatedPreferences = formData.disease.includes(option)
      ? formData.disease.filter((item: string) => item !== option)
      : [...formData.disease, option]
    // console.log(updatedPreferences)
    updateFormData({ disease: updatedPreferences })
  }

  return (
    <div className="space-y-4">
      {dietaryOptions.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={option}
            checked={formData.disease.includes(option)}
            onCheckedChange={() => handleCheckboxChange(option)}
            required
          />
          <Label htmlFor={option}>{option}</Label>
        </div>
      ))}
      <div>
        <Label htmlFor="other">โรคประจำตัวอื่นๆ</Label>
        <Textarea placeholder="ระบุโรคประจำตัวอื่นๆ." onChange={(e) => updateFormData({ disease_other : e.target.value})} value={formData.disease_other || ""}/>
      </div>

      {errors.disease && (
        <p className="text-red-500 text-sm mt-1">{errors.disease}</p>
      )}
    </div>
  )
}

