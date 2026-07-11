import { IconBrush, IconVinyl } from '@tabler/icons-react';
import { SakuraButton } from "@/components/button/button.tsx";
import { useLocation } from "react-router-dom";
import { Tabs } from "@/components/tab/tab.tsx";

export function SettingsTabs() {
  const path = useLocation().pathname;

  return (
    <Tabs>
      <SakuraButton elem="link" href="/settings" identifyOwn="tab2" primary={path == '/settings'}>
        <IconBrush size={14} />
        Appearance
      </SakuraButton>
      <SakuraButton elem="link" href="/settings/playback" identifyOwn="tab2" primary={path == '/settings/playback'}>
        <IconVinyl size={14} />
        Playback
      </SakuraButton>
    </Tabs>
  );
}
