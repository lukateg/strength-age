import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FeatureFlagTooltip({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{children}</div>
      </TooltipTrigger>
      <TooltipContent>
        <p>To be implemented...</p>
      </TooltipContent>
    </Tooltip>
  );
}
