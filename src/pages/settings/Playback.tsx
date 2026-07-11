"use client";

import { SakuraSetting, SakuraSettingGroup } from '@/components/setting/setting.tsx';
import { MAX_VOLUME } from '@/api/player.ts';
import { useSettings } from '@/api/settings.ts';
import { SettingsTabs } from './tab.tsx';

export function Playback() {
  const scrobble = useSettings(s => s.scrobble);
  const setScrobble = useSettings(s => s.setScrobble);

  const volume = useSettings(s => s.volume);
  const setVolume = useSettings(s => s.setVolume);

  return (
    <>
      <SettingsTabs />
      <SakuraSettingGroup>
        <SakuraSetting name="Scrobble to server" body="Must be configured in your Navidrome server" value={scrobble} onChange={setScrobble} />
      </SakuraSettingGroup>
      <SakuraSettingGroup>
        <SakuraSetting name="Audio volume" value={volume} onChange={setVolume} max={MAX_VOLUME} showSliderTooltipAs="percent" />
      </SakuraSettingGroup>
    </>
  )
}
