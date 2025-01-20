import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ViewToggleProps {
  expanded: boolean
  onToggle: (checked: boolean) => void
}

export function ViewToggle({ expanded, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="expanded-view"
        checked={expanded}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-[#0089ab]"
      />
      <Label htmlFor="expanded-view" className="text-sm text-[#455a64] whitespace-nowrap">
        Show all months
      </Label>
    </div>
  )
}

