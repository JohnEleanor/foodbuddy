import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserData {
  user_id: number;
  user_name: string;
  user_displayName: string;
  user_gender: "male" | "female" | "other";
  user_age: number;
  user_height: number;
  user_weight: number;
  user_bmi: number;
  user_target: string;
  user_targetweight: number;
  user_dailycalories: number;
  user_lifestyle:
    | "sedentary"
    | "lightly active"
    | "moderately active"
    | "very active"
    | "super active";
  user_disease: string;
  user_foodallery: string;
  user_lineId: string;
  user_pictureUrl: string;
}

interface UserContextProps {
  userData: UserData | null;
  loading: boolean;
  getUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  userData: null,
  loading: true,
  getUserData: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const getUserData = async () => {
    try {
      const _userData = localStorage.getItem("Jay:userData");
      if (_userData) {
        const storedData = JSON.parse(_userData);
        const response = await fetch(`/api/users/${storedData.userId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.message === "User found" && result.status === 200) {
            setUserData(result.data);
          } else {
            toast.error(
              result.message + " Status: " + result.status.toString()
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
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading, getUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);