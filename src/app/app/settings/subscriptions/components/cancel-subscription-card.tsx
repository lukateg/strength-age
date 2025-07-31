import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
    <Card className="flex flex-col ">
      <CardHeader>
        <CardTitle>Cancel Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Unsubscribe from your subscription at any time.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <AlertDialogModal
          title="Cancel Subscription"
          variant="destructive"
          description="Are you sure you want to cancel your subscription?"
          onConfirm={handleCancelSubscription}
          alertTrigger={
            <Button variant="destructive">Cancel Subscription</Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
