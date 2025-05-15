import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

import AlertDialogModal from "./alert-dialog";

import { Trash } from "lucide-react";

export default function DangerZone({ onDelete }: { onDelete: () => void }) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>
          The following actions are destructive and cannot be undone.
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <AlertDialogModal
          title="Are you sure?"
          description="This action cannot be undone. This will permanently delete this
                resource and all associated data."
          onConfirm={onDelete}
          variant="destructive"
          alertTrigger={
            <Button variant="destructive">
              <Trash className="h-4 w-4" />
              <span className="ml-2">Delete</span>
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
