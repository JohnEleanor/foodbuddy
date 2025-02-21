
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MousePointerClick } from 'lucide-react';
import { Input } from "@/components/ui/input";

const target_weight = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]


interface TargetStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  errors: any;
}

function roundToNextTen(num : number) {
  return Math.ceil(num / 10) * 10;
}


/**
 * การตั้งเป้าหมายน้ำหนักของคุณ
 * ? เงื่อนไขในการตั้งเป้าหมายน้ำหนัก
 * ! 1. เพิ่มได้ไม่เกิน 30 กิโลกรัม
 * ! 2. ลดได้ไม่เกิน 30 กิโลกรัม

 */
export function targetWeightStep({
  formData,
  updateFormData,
  errors,
}: TargetStepProps) {
  const [goal, setGoal] = useState(roundToNextTen(formData.weight) || 30);

  function onClick(adjustment: number) {
    const newGoal = goal + adjustment;
    setGoal(newGoal);
    updateFormData({ target_weight: newGoal });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-6">เป้าหมายของคุณ</h2>
      <p className="text-sm text-muted-foreground mb-6">
        กรุณากรอกข้อมูลของคุณเพื่อนำไปคำนวณและปรับปรุงสุขภาพของคุณ
      </p>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>ลดน้ำหนักเท่าไหร่ถึงไม่เป็น อันตราย?</AccordionTrigger>
          <AccordionContent>
            📢 การลดน้ำหนัก 2-4 กิโลกรัมต่อเดือน เป็นเป้าหมายที่ปลอดภัยและเหมาะสม ทั้งนี้ขึ้นอยู่กับน้ำหนักเริ่มต้นและสภาพร่างกายของแต่ละคน หากไม่แน่ใจ ควรปรึกษานักโภชนาการหรือแพทย์เพื่อให้คำแนะนำที่เหมาะสมกับตัวคุณ 😊
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex justify-center">
        <Drawer onOpenChange={(open) => console.log(open)}>
          <DrawerTrigger asChild>
            <Button variant="outline"><MousePointerClick/>ตั้งเป้าหมายน้ำหนัก</Button>
          </DrawerTrigger>
          <DrawerContent >
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>เป้าหมายน้ำหนักของคุณ</DrawerTitle>
                <DrawerDescription>นี้เป็นการตั้งเป้าหมายถึงน้ำหนักที่คุณต้องการ</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => onClick(-1)}
                    disabled={goal <= 30} // disable ปุ่มหาก goal น้อยกว่าหรือเท่ากับ 200
                  >
                    <Minus />
                    <span className="sr-only">Decrease</span>
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-7xl font-bold tracking-tighter">
                      {goal}
                    </div>
                    <div className="text-[0.70rem] uppercase text-muted-foreground">
                      กิโลกรัม
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => onClick(1)}
                    disabled={goal >= roundToNextTen(formData.weight + 30)}
                  >
                    <Plus />
                    <span className="sr-only">Increase</span>
                  </Button>
                </div>
                <div className="mt-3 h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={target_weight}>
                      <Bar
                        dataKey="goal"
                        style={
                          {
                            fill: "hsl(var(--foreground))",
                            opacity: 0.9,
                          } as React.CSSProperties
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <DrawerFooter>
                <Button onClick={() => updateFormData({ target_weight: goal })}>ยืนยัน</Button>
                <DrawerClose asChild>
                  <Button variant="outline">ปิด</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
        <Input value={formData.target_weight || goal} className="hidden"></Input>
      </div>

    
      {errors.target_weight && (
        <p className="text-red-500 text-sm mt-2">{errors.target_weight}</p>
      )} 
    </div>
  );
}
