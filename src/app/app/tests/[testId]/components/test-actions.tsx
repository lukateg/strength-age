import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import AlertDialogModal from "@/components/alert-dialog";

export function TestActions({
  handleRetakeTest,
}: {
  handleRetakeTest: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <AlertDialogModal
        onConfirm={handleRetakeTest}
        title="Retake Test"
        description="After you press confirm you will be redirected to the test. Good luck!"
        variant="default"
        alertTrigger={
          <Button className="w-full" variant="default">
            <Play className="h-4 w-4" />
            <span className="block">Start Test</span>
          </Button>
        }
      />
    </div>
  );
}
