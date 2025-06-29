import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettingsMutations } from "@/hooks/use-settings-mutations";

export default function SharingSettingsCard({
  shouldTestReviewLinksExpire,
}: {
  shouldTestReviewLinksExpire?: boolean;
}) {
  const { handleLinkExpirationChange } = useSettingsMutations();

  return (
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
            <Label htmlFor="link-expiration" className="text-base font-medium">
              Link Expiration
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically expire sharable test links after 7 days
            </p>
          </div>
          <Switch
            id="link-expiration"
            checked={shouldTestReviewLinksExpire}
            onCheckedChange={handleLinkExpirationChange}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Security Information</h4>
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">
              {shouldTestReviewLinksExpire
                ? "✓ Links will expire after 7 days for enhanced security"
                : "⚠ Links will remain active indefinitely"}
            </p>
            <p className="text-sm text-muted-foreground">
              {shouldTestReviewLinksExpire
                ? "This setting helps protect your test data by automatically removing access to shared links after 7 days."
                : "Links will remain accessible until manually revoked. Consider enabling expiration for better security."}
            </p>
            <p className="text-sm text-muted-foreground">
              You can always regenerate links or revoke access manually from the
              test management page.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
