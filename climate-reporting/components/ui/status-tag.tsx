import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DollarSign, User, AlertCircle } from 'lucide-react'

const statusTagVariants = cva(
  "inline-flex items-center rounded-full px-2 py-1 relative z-40",
  {
    variants: {
      variant: {
        financial: "bg-[#ccecf4] text-[#00718d]",
        manual: "bg-[#fff3cd] text-[#8c6a04]",
        warning: "bg-[#fcdad7] text-[#983136]",
      },
    },
    defaultVariants: {
      variant: "financial",
    },
  }
)

interface StatusTagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusTagVariants> {
  tooltip: string
  type: 'financial' | 'manual' | 'warning'
}

export function StatusTag({ className, variant, tooltip, type, ...props }: StatusTagProps) {
  const Icon = {
    financial: DollarSign,
    manual: User,
    warning: AlertCircle,
  }[type]

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(statusTagVariants({ variant }), className)} {...props}>
            <Icon className="h-3 w-3" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="z-50">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

