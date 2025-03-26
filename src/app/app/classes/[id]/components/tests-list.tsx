import { Button } from "@/components/ui/button";
import ListItem from "@/components/list-item";

import { Brain, FileText, Loader } from "lucide-react";

import { type PDFType } from "@/types/types";

export default function TestsList({ tests }: { tests?: PDFType[] }) {
  //   if (!tests) {
  //     return <Loader />;
  //   }

  //   if (tests.length === 0) {
  //     return (
  //       <div className="text-center py-12">
  //         <h3 className="text-lg font-medium">No Tests Yet</h3>
  //         <p className="text-muted-foreground mt-2">
  //           Create your first test to get started!
  //         </p>
  //       </div>
  //     );
  //   }

  return (
    <>
      <div className="space-y-4">
        {["Test 1 - Calculus Basics", "Test 2 - Derivatives Practice"].map(
          (test) => (
            <div
              key={test}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{test}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Take Test
                </Button>
                <Button variant="outline" size="sm">
                  View Results
                </Button>
              </div>
            </div>
          )
        )}
      </div>
      {/* {tests?.map((test) => (
        <ListItem key={test._id} variant="outline">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{test?.name}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Preview
            </Button>
          </div>
        </ListItem>
      ))} */}
    </>
  );
}
