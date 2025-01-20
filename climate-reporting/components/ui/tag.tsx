import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-[#ccebee] text-[#0089ab]",
        blue: "bg-blue-100 text-blue-800",
        green: "bg-green-100 text-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

function Tag({ className, variant, ...props }: TagProps) {
  return <span className={cn(tagVariants({ variant }), className)} {...props} />
}

export { Tag, tagVariants }

