"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import { StatusTag } from "@/components/ui/status-tag"
import { useState } from "react"
import { cn } from "@/lib/utils"

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const

const years = ['2023', '2024'] as const

type YearData = {
  [key: string]: {
    isOverrideActive: boolean;
    manualInput: boolean;
    monthlyData: { [key: string]: string };
  }
}

export default function Page() {
  const [selectedYear, setSelectedYear] = useState<string>(years[years.length - 1])
  const [selectedMonth, setSelectedMonth] = useState<string>(months[months.length - 1].toLowerCase())
  const [showInfoBox, setShowInfoBox] = useState(true)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [energyData, setEnergyData] = useState(() => {
    return energyTypes.map(type => ({
      ...type,
      yearData: years.reduce((acc, year) => ({
        ...acc,
        [year]: {
          isOverrideActive: false,
          manualInput: false,
          monthlyData: Object.fromEntries(months.map(month => [month.toLowerCase(), type.amount || '']))
        }
      }), {} as YearData)
    }))
  })

  const handleInputChange = (index: number, value: string, month?: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) && value !== '') return

    setEnergyData(prev => prev.map((item, i) => {
      if (i === index) {
        const newItem = { ...item }
        const yearDataCopy = { ...newItem.yearData[selectedYear] }
        if (month) {
          yearDataCopy.monthlyData = { ...yearDataCopy.monthlyData, [month]: value }
        } else {
          yearDataCopy.monthlyData = Object.fromEntries(
            Object.entries(yearDataCopy.monthlyData).map(([key, _]) => [key, value])
          )
        }
        yearDataCopy.manualInput = !item.isFinancialLocked || yearDataCopy.isOverrideActive
        newItem.yearData[selectedYear] = yearDataCopy
        return newItem
      }
      return item
    }))
  }

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth.toLowerCase())
  }

  const calculateYearTotal = (monthlyData: { [key: string]: string }): number => {
    return Object.values(monthlyData).reduce((sum, value) => {
      const num = parseFloat(value)
      return sum + (isNaN(num) ? 0 : num)
    }, 0)
  }

  const handlePreviousMonth = () => {
    const currentIndex = months.findIndex(m => m.toLowerCase() === selectedMonth)
    if (currentIndex > 0) {
      handleMonthChange(months[currentIndex - 1])
    }
  }

  const handleNextMonth = () => {
    const currentIndex = months.findIndex(m => m.toLowerCase() === selectedMonth)
    if (currentIndex < months.length - 1) {
      handleMonthChange(months[currentIndex + 1])
    }
  }

  const isFirstMonth = selectedMonth === months[0].toLowerCase()
  const isLastMonth = selectedMonth === months[months.length - 1].toLowerCase()

  const handleOverride = (index: number) => {
    setEnergyData(prev => prev.map((item, i) => {
      if (i === index) {
        const newItem = { ...item }
        newItem.yearData[selectedYear] = {
          ...newItem.yearData[selectedYear],
          isOverrideActive: true
        }
        return newItem
      }
      return item
    }))
  }

  const handleRevert = (index: number) => {
    setEnergyData(prev => prev.map((item, i) => {
      if (i === index) {
        const newItem = { ...item }
        newItem.yearData[selectedYear] = {
          isOverrideActive: false,
          manualInput: false,
          monthlyData: Object.fromEntries(months.map(month => [month.toLowerCase(), item.originalAmount]))
        }
        return newItem
      }
      return item
    }))
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="mb-8 max-w-3xl">
        <button className="flex items-center text-[#0089ab] hover:text-[#0089ab]/90">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between max-w-3xl">
          <h1 className="text-2xl font-semibold">Update {'{indicatorName}'}</h1>
          <span className="text-sm px-2 py-1 bg-[#ccebee] text-[#455a64] rounded">
            {'{indicatorId}'}
          </span>
        </div>

        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0089ab] text-white flex items-center justify-center">
                1
              </div>
              <span className="font-medium">Update energy data</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                2
              </div>
              <span>Review energy changes</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                3
              </div>
              <span>Review emission changes</span>
            </div>
          </div>
        </div>

        {showInfoBox && (
          <Card className="p-6 bg-[#ccebee] border-none max-w-3xl">
            <p className="text-[#455a64]">
              Now's a great time to find all your energy use data from receipts and invoices! You may update just the energy types that are required to produce the selected indicator, or load more if you have the data available anyway. Make updates to as many months as you wish before you click next. Find more info in the right help menu.
            </p>
            <Button
              variant="secondary"
              className="mt-4 bg-white hover:bg-white/90 text-[#455a64]"
              onClick={() => setShowInfoBox(false)}
            >
              Got it
            </Button>
          </Card>
        )}


        <Card className="bg-white border border-gray-200 w-full">
          <div className="flex flex-col">

            <div className="overflow-x-auto max-w-full">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-[#f8f8f9] relative z-50">
                  <tr>
                    <th scope="col" className="min-w-[10rem] px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 z-20 bg-[#f8f8f9] whitespace-nowrap w-[10rem]">
                      Energy source
                    </th>
                    <th scope="col" className="w-full min-w-[16rem] px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-40 z-20 bg-[#f8f8f9] whitespace-nowrap">
                      Energy subtype
                    </th>
                    <th scope="col" className="w-24 min-w-[5rem] px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-[26rem] z-20 bg-[#f8f8f9] whitespace-nowrap">
                      Unit
                    </th>
                    <th scope="col" className="w-24 px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      <div className="pr-1 flex items-center justify-end gap-1">
                        <span className="truncate">Total for</span>
                        <div className="w-[80px]">
                          <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="h-7 px-2">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-full">
                      <div className="text-right pr-[2.5rem] flex items-center justify-end gap-2">
                        <span>Amount for</span>
                        <div className="w-[120px]">
                          <Select value={selectedMonth} onValueChange={handleMonthChange}>
                            <SelectTrigger className="h-7 px-2">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                              {months.map(month => (
                                <SelectItem key={month} value={month.toLowerCase()}>{month}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 z-30 bg-[#f8f8f9] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {energyData.map((type, index) => (
                    <tr 
                      key={index}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className="relative"
                    >
                      <td className="min-w-[10rem] px-4 py-3 whitespace-nowrap text-sm text-gray-900 sticky left-0 bg-white z-10 w-[10rem]">
                        {type.source}
                      </td>
                      <td className="w-full min-w-[16rem] px-4 py-3 whitespace-nowrap text-sm text-gray-900 sticky left-40 bg-white z-10">
                        {type.subtype}
                      </td>
                      <td className="w-24 min-w-[5rem] px-4 py-3 whitespace-nowrap text-sm text-gray-900 sticky left-[26rem] bg-white z-10">
                        {type.unit}
                      </td>
                      <td className="w-24 px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {calculateYearTotal(type.yearData[selectedYear].monthlyData).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 w-full relative">
                        <div className="flex items-center justify-end gap-2">
                          <div
                            className={cn(
                              "transition-opacity duration-300 z-10",
                              hoveredRow === index ? "opacity-100" : "opacity-0"
                            )}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handlePreviousMonth}
                              disabled={isFirstMonth}
                              className="h-8 w-8 text-[#455a64]"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            step="any"
                            value={type.yearData[selectedYear].monthlyData[selectedMonth] || ''}
                            onChange={(e) => handleInputChange(index, e.target.value, selectedMonth)}
                            disabled={type.isFinancialLocked && !type.yearData[selectedYear].isOverrideActive}
                            className="w-full text-right pr-2 placeholder:italic placeholder:text-gray-400"
                            style={{ minWidth: '9rem' }}
                            placeholder={`-- Enter data for ${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)} --`}
                          />
                          <div
                            className={cn(
                              "transition-opacity duration-300 z-10",
                              hoveredRow === index ? "opacity-100" : "opacity-0"
                            )}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleNextMonth}
                              disabled={isLastMonth}
                              className="h-8 w-8 text-[#455a64]"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 sticky right-0 bg-white z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {type.yearData[selectedYear].manualInput && (
                              <StatusTag
                                variant="manual"
                                type="manual"
                                tooltip="You have entered manual inputs (not yet published)"
                              />
                            )}
                            {type.yearData[selectedYear].isOverrideActive && (
                              <StatusTag
                                variant="warning"
                                type="warning"
                                tooltip="Override active. Review the estimate and enter actual amounts."
                              />
                            )}
                            {type.isFinancialLocked && !type.yearData[selectedYear].isOverrideActive && type.amount && (
                              <StatusTag
                                variant="financial"
                                type="financial"
                                tooltip="Estimated from financial data"
                              />
                            )}
                          </div>
                          {type.canOverride && (
                            <div className="relative z-50">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-[#455a64]"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!type.yearData[selectedYear].isOverrideActive ? (
                                    <DropdownMenuItem onClick={() => handleOverride(index)}>
                                      Override {selectedYear} with manual inputs
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleRevert(index)}>
                                      Revert {selectedYear} to financial estimates
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            variant="outline"
            className="text-[#0089ab] border-[#0089ab] hover:bg-[#ccebee]/50"
          >
            Save draft and close
          </Button>
          <Button className="bg-[#0089ab] hover:bg-[#0089ab]/90 text-white">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

const energyTypes = [
  {
    source: 'Biofuels',
    subtype: 'Bioethanol',
    unit: 'litres',
    amount: '',
    originalAmount: '',
    isFinancialLocked: false,
    canOverride: false
  },
  {
    source: 'Biofuels',
    subtype: 'Biodiesel (methyl ester)',
    unit: 'litres',
    amount: '490',
    originalAmount: '490',
    isFinancialLocked: true,
    canOverride: true
  },
  {
    source: 'Electricity',
    subtype: 'Purchased electricity without guarantees',
    unit: 'kWh',
    amount: '1367',
    originalAmount: '1367',
    isFinancialLocked: true,
    canOverride: true
  },
  {
    source: 'Electricity',
    subtype: 'Purchased electricity with guarantees',
    unit: 'kWh',
    amount: '0',
    originalAmount: '0',
    isFinancialLocked: true,
    canOverride: true
  },
  {
    source: 'Electricity',
    subtype: 'Self generated renewable energy',
    unit: 'kWh',
    amount: '',
    originalAmount: '',
    isFinancialLocked: false,
    canOverride: false
  }
]

