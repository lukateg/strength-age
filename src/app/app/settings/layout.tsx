import { SettingsSidebar } from "./components/settings-sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row flex-1 h-full overflow-hidden">
      <SettingsSidebar />
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
}
