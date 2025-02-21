"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-switcher";

import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HistoryEatProvider } from "@/context/HistoryEatContext";
import { UserProvider } from "@/context/userContext";

// ?  Librarie
interface UserData {
  user_id: number; // Unique identifier for the user
  user_name: string; // Full name of the user
  user_displayName: string; // Display name of the user
  user_gender: "male" | "female" | "other"; // Gender of the user
  user_age: number; // Age of the user
  user_height: number; // Height in cm
  user_weight: number; // Weight in kg
  user_bmi: number; // Body Mass Index
  user_target: string; // Target, e.g., "เพิ่มน้ำหนัก"
  user_targetweight: number; // Target weight in kg
  user_dailycalories: number; // Recommended daily calorie intake
  user_lifestyle:
    | "sedentary"
    | "lightly active"
    | "moderately active"
    | "very active"
    | "super active"; // Lifestyle activity level
  user_disease: string; // Any diseases or conditions
  user_foodallery: string; // Food allergies, if any
  user_lineId: string; // Line ID
  user_pictureUrl: string; // Profile picture URL
}

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData[]>([]);
  const getUserData = async () => {
    try {
      if (userData.length <= 0) {
        const _userData = localStorage.getItem("Jay:userData");
        if (_userData) {
          const userData = JSON.parse(_userData);
          const data = await fetch(`/api/users/${userData.userId}`);
          if (data.status == 200) {
            const result = await data.json();
            if (result.message == "User found" && result.status == 200) {
              setUserData(result.data);
            } else {
              toast.error(
                result.message + " Status : " + result.status.toString()
              );
              router.push("/");
            }
          } else {
            toast.error("Server error");
            router.push("/");
          }
        } else {
          toast.error("User data not found");
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:");
    }
  };

  useEffect(() => {
    getUserData();
  }, [userData]);

  return (
    <>
      <UserProvider>
        <HistoryEatProvider>
          <SidebarProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <AppSidebar userData={userData} />
            </Suspense>
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="w-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                </div>
                <div className="ml-auto px-4">
                  <ModeToggle />
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </HistoryEatProvider>
      </UserProvider>
    </>
  );
}
