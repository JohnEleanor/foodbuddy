import { useState, useCallback } from 'react'

export function useDatePicker(initialDate: Date = new Date()) {
  const [date, setDate] = useState<Date>(initialDate)

  const setMonth = useCallback((month: number) => {
    setDate(prev => new Date(prev.getFullYear(), month, prev.getDate()))
  }, [])

  const setYear = useCallback((year: number, isBuddha: boolean = false) => {
    const gregorianYear = isBuddha ? year - 543 : year
    setDate(prev => new Date(gregorianYear, prev.getMonth(), prev.getDate()))
  }, [])

  const getBuddhaYear = useCallback((date: Date) => {
    return date.getFullYear() + 543
  }, [])

  const getThaiMonth = useCallback((date: Date) => {
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]
    return thaiMonths[date.getMonth()]
  }, [])

  return {
    date,
    setDate,
    setMonth,
    setYear,
    getBuddhaYear,
    getThaiMonth,
  }
}

