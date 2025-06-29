"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
// import { useToast } from '@/hooks/use-toast';

export default function TestsPage() {
  const [paginationEnabled, setPaginationEnabled] = useState(true);
  const [linkExpirationEnabled, setLinkExpirationEnabled] = useState(true);
  //   const { toast } = useToast();

  const handlePaginationChange = (enabled: boolean) => {
    setPaginationEnabled(enabled);
    // toast({
    //       title: 'Settings Updated',
    //       description: `Pagination ${enabled ? 'enabled' : 'disabled'} for tests.`,
    //     });
  };

  const handleLinkExpirationChange = (enabled: boolean) => {
    setLinkExpirationEnabled(enabled);
    //     toast({
    //       title: 'Settings Updated',
    //       description: `Sharable link expiration ${enabled ? 'enabled' : 'disabled'}.`,
    //     });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Test Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure how your tests behave and are shared
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>
            Control how tests are displayed to students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pagination" className="text-base font-medium">
                Enable Pagination
              </Label>
              <p className="text-sm text-muted-foreground">
                Show tests with pagination instead of all questions on one page
              </p>
            </div>
            <Switch
              id="pagination"
              checked={paginationEnabled}
              onCheckedChange={handlePaginationChange}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Pagination Preview</h4>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {paginationEnabled
                  ? "Students will see one question at a time with navigation buttons"
                  : "Students will see all questions on a single scrollable page"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sharing Settings</CardTitle>
          <CardDescription>
            Manage how test links are shared and accessed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="link-expiration"
                className="text-base font-medium"
              >
                Link Expiration
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically expire sharable test links after 7 days
              </p>
            </div>
            <Switch
              id="link-expiration"
              checked={linkExpirationEnabled}
              onCheckedChange={handleLinkExpirationChange}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Security Information</h4>
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">
                {linkExpirationEnabled
                  ? "✓ Links will expire after 7 days for enhanced security"
                  : "⚠ Links will remain active indefinitely"}
              </p>
              <p className="text-sm text-muted-foreground">
                You can always regenerate links or revoke access manually from
                the test management page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Analytics</CardTitle>
          <CardDescription>
            Configure how test performance data is collected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">
                Current Configuration
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Student responses are anonymized</li>
                <li>• Performance metrics are aggregated</li>
                <li>• Individual student data is protected</li>
                <li>• Results are available for 90 days</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
