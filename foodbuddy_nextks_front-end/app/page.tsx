"use client";

// ? Libraries
import Image from "next/image";
import liff from "@line/liff";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ? Components
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// ? Image assets
import LoginImage from "./assets/login_img.png";

import { Loader2 } from "lucide-react";

// ? Pages
import { toast } from "sonner";


const initLiff = async () => {
try {
  if (!process.env.NEXT_PUBLIC_LINE_LIFF_ID) {
      throw new Error("LIFF ID is not defined");
    }

    await liff.init({
      liffId: process.env.NEXT_PUBLIC_LINE_LIFF_ID,
    });

    if (!liff.isLoggedIn()) {
      liff.login();
    } else {
      const profile = await liff.getProfile();
      console.log("User ID:", profile.userId);
      console.log("Display Name:", profile.displayName);
      console.log("Status Message:", profile.statusMessage);
      console.log("Picture URL:", profile.pictureUrl);

      fetch(`http://localhost:8000/user/lineliff/{}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile), // data you want to send
      });

      // ตรวจสอบสิทธิ์ที่ผู้ใช้ให้
      const permission = await liff.permission.query("profile");
      if (permission.state === "granted") {
        // ดำเนินการกับข้อมูลโปรไฟล์ที่ได้รับ
        // const params = new URLSearchParams();
        // params.append("grant_type", "authorization_code");
        // params.append("code", authorizationCode);
        // params.append("redirect_uri", redirectUri);
        // params.append("client_id", channelId);
        // params.append("client_secret", channelSecret);

        // const response = await fetch("https://api.line.me/oauth2/v2.1/token", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/x-www-form-urlencoded",
        //   },
        //   body: params.toString(),
        // });

        // if (!response.ok) {
        //   throw new Error(`Server error: ${response.status}`);
        // }

        // const data = await response.json();
        // const accessToken = data.access_token;
        // const idToken = data.id_token;
        // const refreshToken = data.refresh_token;
      } else {
        console.error("User has not granted profile permission");
      }
    }
  } catch (error) {
    console.error("Failed to initialize LIFF:", error);
  }
};

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // State สำหรับการโหลด

  const handdleLogin = async () => {
    setIsLoading(true); // เริ่มการโหลด

    try {
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const userProfile = await liff.getProfile(); // รอจนกว่าจะได้ข้อมูล
        const encodedData = JSON.stringify(userProfile);

        console.log("LIFF initialized");
        localStorage.setItem("Jay:userData", encodedData);
        const _userData = localStorage.getItem("Jay:userData");
        if (_userData) {
          const userData = JSON.parse(_userData);
          const result = await fetch(`/api/users/${userData.userId}`);
          const response = await result.json();
          // console.log(response)
          if (response.message == "Internal server error") {
            setIsLoading(false);
            toast.error(
              "เกิดข้อผิดพลาดเข้าสู่ระบบไม่สำเร็จ : " + response.message
            );
          } else {
            if (response.message == "User found" && response.status == 200) {
              setIsLoading(false);
              router.push("/dashboard");
              toast.success("เข้าสู่ระบบสำเร็จ");
            } else {
              setIsLoading(false);
              router.push("/register");
              toast.info("กรุณาลงทะเบียนข้อมูลของคุณ");
            }
          }
        } else {
          console.error("User data not found");
          toast.error("เกิดข้อผิดพลาดเข้าสู่ระบบไม่สำเร็จ");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("เกิดข้อผิดพลาดเข้าสู่ระบบไม่สำเร็จ ");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initLiff();
  }, []);

  return (
    <>
      <div className="w-full lg:min-h-[1366px] lg:grid lg:grid-cols-2 xl:min-h-[980px]">
        <AspectRatio className="block">
          <Image src={LoginImage} alt="FoodBuddy" fill={true} />
        </AspectRatio>
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">เข้าสู่ระบบ</h1>
              <p className="text-balance text-muted-foreground">
                กรุณาเข้าสู่ระบบด้วย Line เพื่อใช้ในการเก็บข้อมูล
              </p>
            </div>
            <div className="grid gap-4">
              <Button
                type="button"
                onClick={handdleLogin}
                className={`w-full shadow-lg ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-lime-600 hover:bg-lime-500"
                }`}
                disabled={isLoading} // ปิดปุ่มเมื่อกำลังโหลด
              >
                {isLoading ? (
                  <div className="flex gap-2">
                    <Loader2 className="animate-spin" /> กรุณารอสักครู่...
                  </div>
                ) : (
                  "Login ด้วย Line Account"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
