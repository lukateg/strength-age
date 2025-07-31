import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscriptions } from "@/hooks/use-subscriptions";

import AlertDialogModal from "@/components/alert-dialog";

export default function CancelSubscriptionCard() {
  const { cancelSubscription } = useSubscriptions();

  const handleCancelSubscription = async () => {
    await cancelSubscription();
  };

  return (
    <Card className="flex items-center justify-between">
      <CardHeader>
        <CardTitle>Cancel Subscription</CardTitle>
        <CardDescription>
          Unsubscribe from your subscription at any time.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <AlertDialogModal
          title="Cancel Subscription"
          variant="destructive"
          description="Are you sure you want to cancel your subscription?"
          onConfirm={handleCancelSubscription}
          alertTrigger={
            <Button variant="destructive">Cancel Subscription</Button>
          }
        />
      </CardContent>
    </Card>
  );
}
