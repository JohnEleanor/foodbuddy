"use client";

import { useState, useEffect } from "react";
import { Heart, Dumbbell, Palette, User, Minus, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton"


import { BMIBadge } from "@/components/setting/BMIBadge";
import { toast } from "sonner";


const data = [
  { goal: 65 },
  { goal: 67 },
  { goal: 70 },
  { goal: 68 },
  { goal: 72 },
  { goal: 71 },
  { goal: 69 },
  { goal: 74 },
  { goal: 73 },
  { goal: 75 },
  { goal: 72 },
  { goal: 76 },
  { goal: 75 },
];

export default function SettingsPage() {
  const [isDirty, setIsDirty] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bmi, setBmi] = useState<number >(1);
  const [weight, setWeight] = useState(70);
  const [loadData, setLoadData] = useState(false);

  const [settings, setSettings] = useState({
    name: "",
    weight: "",
    height: "",
    age: "",
    bmi: bmi | 0,
    disease: [""],
    foodallery: [""],
    otherHealthInfo: "",
    otherFoodInfo: "",
    targetWeight: 0,
    lifestyle: "",
  });

  function onClick(adjustment: number) {
    const newWeight = Math.max(40, Math.min(150, weight + adjustment));
    setWeight(newWeight);
    setSettings((prev) => ({ ...prev, targetWeight: newWeight })); // Ensure the new weight is set in both `weight` and `settings`
    setIsDirty(true);
  }

  const getUserData = async () => {
    const _userData = localStorage.getItem("Jay:userData");
    if (_userData) {
      try {
        const data = JSON.parse(_userData);
        const userResponse = await fetch(`/api/users/${data.userId}`);
        const response = await userResponse.json();

        if (response.message === "User found" && response.status === 200) {
          setSettings((prevSettings) => ({
            ...prevSettings,
            name: response.data.user_name,
            weight: response.data.user_weight,
            height: response.data.user_height,
            age: response.data.user_age,
            lifestyle: response.data.user_lifestyle,
            targetWeight: response.data.user_targetweight,
            foodallery: response.data.user_foodallery, // Ensure foodallery is an array
            disease: response.data.user_disease,
          }));
          setWeight(response.data.user_targetweight);
          setLoadData(true);
        } else {
          console.error("User data not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setIsDirty(true);
  };


  const diseaseOptions = [
    "เบาหวาน",
    "ความดันโลหิต",
    "โรคหัวใจ",
    "โรคอ้วน",
    "คลอเลสเตอรอลสูง",
    "ไม่มี"
  ]

  const handlediseaseChange = (option: string) => {
    setSettings((prev) => {
      const currentDisease = Array.isArray(prev.disease) ? prev.disease : [];
      const updatedPreferences = currentDisease.includes(option)
        ? currentDisease.filter((item) => item !== option) // Remove if already selected
        : [...currentDisease, option]; // Add if not selected
  
      return { ...prev, disease: updatedPreferences };
    });
    setIsDirty(true);
  };

  const foodOptions = [
    "ถั่ว",
    "นม",
    "กลูเตน",
    "ไข่",
    "ถั่วเหลือง",
    "ไม่มี"
  ]
  const handleFoodChange = (option: string) => {
    setSettings((prev) => {
      const currentAllergies = Array.isArray(prev.foodallery) ? prev.foodallery : [];
      const updatedPreferences = currentAllergies.includes(option)
        ? currentAllergies.filter((item) => item !== option) // Remove if already selected
        : [...currentAllergies, option]; // Add if not selected
  
      return { ...prev, foodallery: updatedPreferences };
    });
    setIsDirty(true);
  };



  const updateUser = async (userId : string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const reponse = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });
  }

  const handleSubmit = async () => {
    const _userData = localStorage.getItem("Jay:userData");
    
    if (_userData) {
      try {
        const data = JSON.parse(_userData);
        const userId = data.userId;
  
        if (userId) {
  
          toast.promise(updateUser(userId), {
            loading: "กำลังอัปเดตข้อมูล...",
            success: "อัปเดตข้อมูลสำเร็จ",
            error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
          });
        } else {
          console.error("User ID not found in localStorage");
          toast.error("ไม่พบข้อมูลผู้ใช้");
        }
      } catch (error) {
        console.error("Error parsing localStorage data or submitting data:", error);
        toast.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
    } else {
      console.error("No user data found in localStorage");
      toast.error("ไม่พบข้อมูลผู้ใช้");
    }
  
    setIsDialogOpen(false);
    setIsDirty(false);
  };
  
  
  useEffect(() => {
    if (!loadData) {
      getUserData();
    }
    if (settings.weight && settings.height) {
      const weightKg = parseFloat(settings.weight);
      const heightM = parseFloat(settings.height) / 100;
      const calculatedBMI = weightKg / (heightM * heightM);
      setSettings((prev) => ({ ...prev, bmi: parseFloat(calculatedBMI.toFixed(2)) }));
      setBmi(calculatedBMI);
    }
  }, [settings.weight, settings.height, loadData]);


  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ตั้งค่า</h1>
        <p className="text-muted-foreground">
          จัดการการตั้งค่าบัญชีและการตั้งค่าที่คุณต้องการ
        </p>
      </div>
      
      
      
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto gap-4 bg-muted p-1 shadow-sm">
          <TabsTrigger
            value="account"
            className="flex gap-2 data-[state=active]:bg-background"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">ข้อมูลส่วนตัว</span>
          </TabsTrigger>
          <TabsTrigger
            value="healthy"
            className="flex gap-2 data-[state=active]:bg-background"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">สุขภาพ</span>
          </TabsTrigger>
          <TabsTrigger
            value="targetWeight"
            className="flex gap-2 data-[state=active]:bg-background"
          >
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">เป้าหมายน้ำหนัก</span>
          </TabsTrigger>
          <TabsTrigger
            value="lifestyle"
            className="flex gap-2 data-[state=active]:bg-background"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">ไลฟ์สไตล์</span>
          </TabsTrigger>
        </TabsList>
        {!loadData ? (<>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                  จัดการข้อมูลส่วนตัวของคุณ
                  <BMIBadge bmi={bmi} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="w-full h-[350px] rounded-lg" />
            </CardContent>
          </Card></>) : (
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                  จัดการข้อมูลส่วนตัวของคุณ
                  <BMIBadge bmi={bmi} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ</Label>
                <Input
                  id="name"
                  name="name"
                  value={settings.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">น้ำหนัก (กก.)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={settings.weight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">ส่วนสูง (ซม.)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={settings.height}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">อายุ</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={settings.age}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        )}

        <TabsContent value="healthy">
          <Card className="mb-3">
            <CardHeader>
              <CardTitle>จัดการสุขภาพของคุณ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>โรคประจำตัวของคุณ</Label>
                {diseaseOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={loadData && settings.disease.includes(option)}
                      onCheckedChange={() => handlediseaseChange(option)}
                      disabled={!loadData}
                    />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherHealthInfo">ข้อมูลสุขภาพอื่นๆ</Label>
                <Textarea
                  id="otherHealthInfo"
                  name="otherHealthInfo"
                  value={settings.otherHealthInfo}
                  onChange={handleInputChange}
                  placeholder="กรอกข้อมูลสุขภาพอื่นๆ ที่นี่..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>จัดการอาหารของคุณ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>การเเพ้อาหารของคุณ</Label>
                {foodOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={loadData && settings.foodallery.includes(option)}
                      onCheckedChange={() => handleFoodChange(option)}
                      disabled={!loadData}
                    />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherFoodInfo">ข้อมูลอาหารอื่นๆ</Label>
                <Textarea
                  id="otherFoodInfo"
                  name="otherFoodInfo"
                  value={settings.otherFoodInfo}
                  onChange={handleInputChange}
                  placeholder="กรอกข้อมูลอาหารอื่นๆ ที่นี่..."
                />
              </div>
            </CardContent>
          </Card>        
        </TabsContent>

        <TabsContent value="targetWeight">
          <Card>
            <CardHeader>
              <CardTitle>จัดการเป้าหมายน้ำหนักของคุณ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 grid-flow-row gird ">
              <div className="grid grid-cols-1 gap-4">
                <Label>
                  เป้าหมายน้ำหนักปัจจุบัน: {settings.targetWeight} กก.
                </Label>

                
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline">ตั้งเป้าหมายน้ำหนัก</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle>ตั้งเป้าหมายน้ำหนัก</DrawerTitle>
                        <DrawerDescription>
                          ปรับเป้าหมายน้ำหนักของคุณในหน่วยกิโลกรัม
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-0">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full"
                            onClick={() => onClick(-1)}
                            disabled={weight <= 40}
                          >
                            <Minus />
                            <span className="sr-only">Decrease</span>
                          </Button>
                          <div className="flex-1 text-center">
                            <div className="text-7xl font-bold tracking-tighter">
                              {weight}
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
                            disabled={weight >= 150}
                          >
                            <Plus />
                            <span className="sr-only">Increase</span>
                          </Button>
                        </div>
                        <div className="mt-3 h-[120px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
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
                        <Button>บันทึกการเปลี่ยนแปลง</Button>
                        <DrawerClose asChild>
                          <Button variant="outline">ยกเลิก</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifestyle">
          <Card>
            <CardHeader>
              <CardTitle>การตั้งค่าลักษณะและไลฟ์สไตล์</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>ไลฟ์สไตล์</Label>
                <Select
                  value={settings.lifestyle}
                  defaultValue={settings.lifestyle || "sedentary"}
                  onValueChange={(value) => {
                    setSettings((prev) => ({ ...prev, lifestyle: value }));
                    setIsDirty(true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกไลฟ์สไตล์" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">
                      นั่งโต๊ะเป็นส่วนใหญ่
                    </SelectItem>
                    <SelectItem value="lightly-active">
                      ออกกำลังกายเบาๆ
                    </SelectItem>
                    <SelectItem value="moderately-active">
                      ออกกำลังกายปานกลาง
                    </SelectItem>
                    <SelectItem value="very-active">ออกกำลังกายหนัก</SelectItem>
                    <SelectItem value="extra-active">
                      ออกกำลังกายหนักมาก
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isDirty && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container mx-auto max-w-4xl flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsDirty(false)}>
              ยกเลิก
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>บันทึกการเปลี่ยนแปลง</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ยืนยันการบันทึกการเปลี่ยนแปลง</DialogTitle>
                  <DialogDescription>
                    คุณแน่ใจหรือไม่ว่าต้องการบันทึกการเปลี่ยนแปลงทั้งหมด?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    ยกเลิก
                  </Button>
                  <Button onClick={handleSubmit}>ยืนยัน</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}

