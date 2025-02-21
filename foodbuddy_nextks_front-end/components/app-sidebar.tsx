"use client";

import * as React from "react";
import {
  History,
  Utensils,
  Frame,
  Map,
  PieChart,
  Settings,
  Loader,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const initialData = {
  user: {
    user_name : "Loading...",
    user_displayName : "Loading...",
    user_pictureUrl : "",
  },
  teams: [
    {
      name: "Food Buddy.",
      logo: Utensils,
      plan: "ตัวช่วยในการกินของคุณ",
      url: "/dashboard",
    },
  ],
  navMain: [
    {
      title: "ประวัติการกิน",
      url: "/dashboard/history",
      icon: History,
      isActive: false,
      items: [
        {
          title: "ประวัติการกินทั้งหมด",
          url: "/dashboard/history",
        },
        
      ],
    },
    {
      title: "ตั้งค่า",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "ตั้งค่าทั่วไป",
          url: "/dashboard/setting",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({
  userData,
  ...props
}: { userData: any } & React.ComponentProps<typeof Sidebar> ) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    // console.log("app-sidebar",userData)
    if (userData) {
      setData((prevData) => ({
        ...prevData,
        user: { ...prevData.user, ...userData },
      }));
      setLoading(false);
    }
   
  }, [userData]);

  if (loading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}   />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
