import { Button } from "@/components/ui/button";
import ListItem from "@/components/list-item";

import { FileText, Loader } from "lucide-react";

import { type Doc } from "convex/_generated/dataModel";

export default function TestsList({ tests }: { tests?: Doc<"tests">[] }) {
  if (!tests) {
    return <Loader />;
  }

  if (tests.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No Tests Yet</h3>
        <p className="text-muted-foreground mt-2">
          Create your first test to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      {tests?.map((test) => (
        <ListItem key={test._id} variant="outline">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{test?.title}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Preview
            </Button>
          </div>
        </ListItem>
      ))}
    </>
  );
}
