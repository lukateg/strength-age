"use client";

import { useUserContext } from "@/providers/user-provider";
import { useTests } from "@/providers/tests-provider";

import GenerateTestForm from "@/components/generate-test-form/generate-test-form";
import RedirectBackButton from "@/components/redirect-back-button";

import { ArrowLeft } from "lucide-react";
import { BookOpen } from "lucide-react";

export default function GenerateTestPage() {
  const { testsByUser } = useTests();
  // const { can } = useUserContext();

  // const canGenerateTest = can("tests", "create", {
  //   existingTestsLength: testsByUser?.data?.length ?? 0,
  // });

  if (testsByUser.isPending) {
    return <div>Loading...</div>;
  }

  // TODO: no permission page
  // if (!canGenerateTest) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen">
  //       <h1 className="text-2xl font-bold">Upgrade to generate test</h1>
  //       <p className="text-muted-foreground">
  //         You need to upgrade to generate tests
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="flex items-center gap-4">
        <RedirectBackButton>
          <ArrowLeft className="h-6 w-6" />
        </RedirectBackButton>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Generate Test</h1>
          </div>
          <p className="text-muted-foreground">
            Create test from existing classes and materials
          </p>
        </div>
      </div>

      <GenerateTestForm />
    </>
  );
}
