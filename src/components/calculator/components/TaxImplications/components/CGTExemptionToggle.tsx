import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";

interface CGTExemptionToggleProps {
  isExempt: boolean;
  onToggle: (checked: boolean) => void;
}

export function CGTExemptionToggle({ isExempt, onToggle }: CGTExemptionToggleProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="cgt-exempt">6-Year CGT Exemption Rule</Label>
          <HoverCard>
            <HoverCardTrigger>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <p className="text-sm">
                  Under the 6-year rule, you can claim the CGT main residence exemption 
                  for up to six years after moving out if you rent out your former home.
                </p>
                <p className="text-sm">
                  Any capital gains during this period will be tax-free. After 6 years, 
                  normal CGT rules apply with a 50% discount on gains.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <Switch
          id="cgt-exempt"
          checked={isExempt}
          onCheckedChange={onToggle}
        />
      </div>
      {isExempt && (
        <p className="text-sm text-muted-foreground">
          Capital gains will be tax-free for the first 6 years. After that, 
          normal CGT rules apply with a 50% discount.
        </p>
      )}
    </div>
  );
}
