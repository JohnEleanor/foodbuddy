import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BMIBadgeProps {
  bmi: number
}

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "น้ำหนักต่ำกว่าเกณฑ์"
  if (bmi < 25) return "น้ำหนักปกติ"
  if (bmi < 30) return "น้ำหนักเกิน"
  return "อ้วน"
}

const getBMIColor = (bmi: number): string => {
  if (bmi < 18.5) return "bg-blue-500 hover:bg-blue-600"
  if (bmi < 25) return "bg-green-500 hover:bg-green-600"
  if (bmi < 30) return "bg-yellow-500 hover:bg-yellow-600"
  return "bg-red-500 hover:bg-red-600"
}

export function BMIBadge({ bmi }: BMIBadgeProps) {
  const roundedBMI = Math.round(bmi * 10) / 10
  const category = getBMICategory(roundedBMI)
  const colorClass = getBMIColor(roundedBMI)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge className={`${colorClass} text-white`}>
            BMI: {roundedBMI}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{category}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

