import { SettingsSidebar } from "./components/settings-sidebar";
import SettingsMobileMenu from "./subscriptions/components/settings-mobile-menu";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row flex-1 h-full overflow-hidden">
      <SettingsSidebar />
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <SettingsMobileMenu />
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}
