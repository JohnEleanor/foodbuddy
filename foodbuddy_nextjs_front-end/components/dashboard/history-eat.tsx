import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function HistoryEat({ data }: any) {

  const invoices = data ? data.map((item: any) => ({
    
    time: new Date(item.eaten_at).toLocaleTimeString(),
    type: item.category,
    calories: item.calories.toString(),
    manuName: item.food_name
  })) : []

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "อาหารคาว" | "อาหารหวาน" | "ของกินเล่น">("all")

  // ฟิลเตอร์ข้อมูลตามประเภทอาหารและคำค้นหา
  const filteredInvoices = invoices.filter((invoice: { type: string; manuName: string; time: string; calories: string }) =>
    (filterType === "all" || invoice.type === filterType) &&
    (invoice.manuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.calories.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <div className="text-xl font-bold">ประวัติการกิน</div>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search">ค้นหา</Label>
          <Input
            id="search"
            type="text"
            placeholder="ค้นหาประวัติการกิน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px]">
          <Label htmlFor="filter-type">ประเภทอาหาร</Label>
          <Select
            value={filterType}
            onValueChange={(value: "all" | "อาหารคาว" | "อาหารหวาน" | "ของกินเล่น") => setFilterType(value)}
          >
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="เลือกประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="อาหารคาว">อาหารคาว</SelectItem>
              <SelectItem value="อาหารหวาน">อาหารหวาน</SelectItem>
              <SelectItem value="ของกินเล่น">ของกินเล่น</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableCaption>ประวัติการกินอาหารของคุณ</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5 font-bold text-primary">เวลา</TableHead>
            <TableHead className="font-bold text-primary">ชื่อเมนู</TableHead>
            <TableHead className="font-bold text-primary">ประเภท</TableHead>
            <TableHead className="text-right font-bold text-primary">จำนวนเเคลอรี่</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                ไม่พบข้อมูลการกินวันนี้
              </TableCell>
            </TableRow>
          ) : (
            filteredInvoices.map((invoice: { time: string; manuName: string; type: string; calories: string }, index: number) => (
              <TableRow key={`${invoice.time}-${index}`}>
                <TableCell>{invoice.time}</TableCell>
                <TableCell>{invoice.manuName}</TableCell>
                <TableCell>{invoice.type}</TableCell>
                <TableCell className="text-right">{invoice.calories} Kcal</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {filteredInvoices.reduce((total: number, invoice: { calories: string }) => total + parseFloat(invoice.calories), 0).toFixed(2)} kcal
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

