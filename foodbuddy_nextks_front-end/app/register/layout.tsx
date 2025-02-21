
import { Toaster } from "@/components/ui/toaster"

export default function RegisterLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
        <>
        <Toaster />
        {children}
        </>
    )
  }