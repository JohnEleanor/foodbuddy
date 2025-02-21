"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PersonalInfoStep } from "@/components/form-steps/personal-info-step";
import { targetStep } from "@/components/form-steps/target-step";
import { DiseaseStep } from "@/components/form-steps/disease-step";
import { SubmissionStep } from "@/components/form-steps/submission-step";
import { LifestyleStep } from "@/components/form-steps/lifestyle-step";
import { targetWeightStep } from "@/components/form-steps/targetWeight-step";
import { foodAllery } from "@/components/form-steps/food-allery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
const steps = [
  { title: "ข้อมูลส่วนตัว", component: PersonalInfoStep }, // case 0
  { title: "ไลฟ์สไตล์", component: LifestyleStep }, // case 1
  { title: "เป้าหมาย" , component: targetStep}, // case 2
  { title: "เป้าหมายน้ำหนัก" , component: targetWeightStep}, // case 3
  { title: "โรคประจำตัว", component: DiseaseStep }, // case 4
  { title: "อาหารที่เเพ้อื่นๆ", component: foodAllery }, // case 5
  { title: "ยืนยันข้อมูล", component: SubmissionStep }, // case 4
];



export function MultiStepForm() {
  const router = useRouter();
  // const [userData, setUserData] = useState<UserData | null>(null);


  // const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    userId: "",
    pictureUrl: "",
    displayName: "",
    name: "",
    age: "",
    weight: "",
    height: "",
    gender : "",
    bmi: 0,
    lifestyle: "",
    target: "",
    target_weight : "",
    disease : [],
    disease_other : "",
    foodallery : [],
    foodallery_other : "",
    dailyCalories : 0
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("Jay:userData");
      const decodeData = storedData ? JSON.parse(storedData) : null;
      setFormData({ ...formData, userId: decodeData?.userId, pictureUrl: decodeData?.pictureUrl, displayName: decodeData?.displayName });

      if (!storedData) {
        console.error("No user data found in local storage");
        router.push("/");
      }
    }
  }, [router]);

  
  const [errors, setErrors] = useState({});

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length === 0) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      } else {
        setIsDialogOpen(true);
      }
    } else {
      setErrors(stepErrors);
      console.error("Step validation failed:", stepErrors);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUpdateFormData = (newData: Partial<typeof formData>) => {
    setFormData({ ...formData, ...newData });
  };

  const validateStep = (step: number, data: typeof formData) => {
    const stepErrors: Record<string, string> = {};
    // console.log("step", step);
    switch (step) {
      case 0: // Personal Info
        if (!data.name.trim()) stepErrors.name = "กรุณาใส่ชื่อของคุณ";
        if (isNaN(Number(data.age)) || Number(data.age) == 0)
          stepErrors.age = "กรุณาใส่อายุของคุณ";
        if (isNaN(Number(data.weight)) || Number(data.weight) == 0)
          stepErrors.weight = "กรุณาใส่น้ำหนักของคุณ";
        if (isNaN(Number(data.height)) || Number(data.height) == 0)
          stepErrors.height = "กรุณาใส่ส่วนสูงของคุณ";
        if (!data.gender.trim()) stepErrors.gender = "กรุณาเลือกเพศของคุณ";
        break;
      case 1: 
        if (!data.lifestyle) stepErrors.lifestyle = "กรุณาเลือกไลฟ์สไตล์ของคุณ";
        break;
      case 2:
        if (!data.target) stepErrors.target = "กรุณาเลือกเป้าหมายของคุณ";
        break;
      case 3:
        if (!data.target_weight) stepErrors.target_weight = "กรุณาเลือกเป้าหมายของคุณ"
        break;
      case 4:
        if (data.disease.length <= 0) stepErrors.disease = "กรุณาเลือกโรคประจำตัวของคุณ";
        break;
      case 5:
        if (data.foodallery.length <= 0) stepErrors.foodallery = "กรุณาเลือกอาหารที่เเพ้อื่นๆของคุณ";
        break;
    }
    return stepErrors;
  };

  
  function calculateCaloriesPerDay(age: number, weight: number, height: number, gender: string, lifestyle: string, target: string): number {
    let BMR: number;

    // Mifflin-St Jeor Equation for BMR calculation
    if (gender === "male") {
      BMR = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
    } else {
      BMR = 665 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
    }

    BMR = Math.round(BMR);
    // console.log(BMR)

    // Adjust BMR based on activity level
    let activityFactor: number;

    switch (lifestyle) {
      case "sedentary":
        activityFactor = 1.2;
        break;
      case "light":
        activityFactor = 1.375;
        break;
      case "moderate":
        activityFactor = 1.55;
        break;
      case "active":
        activityFactor = 1.725;
        break;
      case "intense":
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2; // Default to sedentary if activity level is not specified
    }

    let calories = Math.round(BMR * activityFactor);

    if (target === "ลดน้ำหนัก") {
      calories -= 500; // Reduce 500 calories to lose weight (1 lb per week)
    } else if (target === "เพิ่มน้ำหนัก") {
      calories += 500; // Add 500 calories to gain weight (1 lb per week)
    }
    return calories;
  }

  const promise = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Make API call
    const response = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: formData.name,
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        gender: formData.gender,
        bmi: formData.bmi,
        lifestyle: formData.lifestyle,
        target: formData.target,
        targetWeight: formData.target_weight,
        disease: formData.disease,
        userFoodAllery: formData.foodallery,
        displayName: formData.displayName,
        lineUserId: formData.userId,
        pictureUrl: formData.pictureUrl,
        dailyCalories: calculateCaloriesPerDay(
          Number(formData.age),
          Number(formData.weight),
          Number(formData.height),
          String(formData.gender),
          String(formData.lifestyle),
          String(formData.target)
        ),
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to save data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  };

 

  

  const handleConfirm = async () => {
    if (termsAccepted) {
      setIsDialogOpen(false);
    
     // Use toast.promise
    toast.promise(promise(), {
      loading: "กำลังบันทึกข้อมูล",
      success: () => {
        router.push('dashboard');
        return "ลงทะเบียนสำเร็จ";
      },
      error: "เกิดข้อผิดพลาดในการลงทะเบียน",
    });

     
    } else {
      toast.error("กรุณายอมรับข้อกำหนดและเงื่อนไข");
    }
  };



  return (
    <>
      {/* <div className="text-2xl">กรอกข้อมูลของคุณ</div> */}
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          </div>
          <CurrentStepComponent
            formData={formData}
            updateFormData={handleUpdateFormData}
            errors={errors}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            ย้อนกลับ
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "ยืนยัน" : "ถัดไป"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>ยืนยันข้อมูล</DialogTitle>
            <DialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการยืนยันข้อมูลของคุณ?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="font-semibold mb-2">ข้อกำหนดและเงื่อนไข</h3>
            <p className="text-sm text-muted-foreground mb-4">
              โดยการยอมรับข้อกำหนดและเงื่อนไขนี้
              คุณยินยอมให้เราใช้ข้อมูลของคุณเพื่อปรับปรุงบริการของเรา
              เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของคุณแก่บุคคลที่สามโดยไม่ได้รับอนุญาตจากคุณ
            </p>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked as boolean)
                }
              />
              {/* <Label htmlFor="terms">ฉันยอมรับข้อกำหนดและเงื่อนไข</Label> */}
              <Label >ฉันยอมรับข้อกำหนดและเงื่อนไข</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleConfirm}>ยืนยัน</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProgressIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex justify-between">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`w-full h-2 rounded-full ${
            index <= currentStep
              ? "bg-lime-500 ease-in duration-300"
              : "bg-gray-200 ease-in duration-300"
          } ${index < totalSteps - 1 ? "mr-1" : ""}`}
        />
      ))}
    </div>
  );
}




