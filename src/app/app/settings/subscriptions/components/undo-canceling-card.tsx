import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStripe } from "@/hooks/use-stripe";

import AlertDialogModal from "@/components/alert-dialog";

export default function UndoCancelingCard() {
  const { undoStripeSubscriptionCancellationAction } = useStripe();

  const handleUndoCancellation = async () => {
    try {
      await undoStripeSubscriptionCancellationAction();
    } catch (error) {
      console.error("Failed to undo subscription cancellation:", error);
    }
  };

  return (
    <Card className="flex items-center justify-between">
      <CardHeader>
        <CardTitle>Undo Canceling</CardTitle>
        <CardDescription>
          By undoing the cancelation of your subscription, you will be back to
          your previous plan without any additional charges.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <AlertDialogModal
          title="Undo Canceling"
          variant="caution"
          description="Are you sure you want to undo the cancelation of your subscription? Your subscription will continue as normal without additional charges."
          onConfirm={handleUndoCancellation}
          alertTrigger={<Button variant="caution">Undo Canceling</Button>}
        />
      </CardContent>
    </Card>
  );
}
