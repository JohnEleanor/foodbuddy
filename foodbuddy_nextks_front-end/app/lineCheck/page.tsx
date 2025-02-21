'use client';
import { useEffect } from "react";
import liff from "@line/liff";

export default function page() {
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

    useEffect(() => {
        initLiff();
    }, [])
    return (
        <></>
        
    )
}
