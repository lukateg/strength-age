import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Share2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AlertDialogModal from "@/components/alert-dialog";

export function TestActions({
  handleRetakeTest,
}: {
  handleRetakeTest: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <AlertDialogModal
            onConfirm={handleRetakeTest}
            title="Retake Test"
            description="After you press confirm you will be redirected to the test. Good luck!"
            variant="positive"
            alertTrigger={
              <Button className="w-full" variant="positive">
                <Play className="h-4 w-4" />
                <span className="hidden md:block">Start Test!</span>
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
