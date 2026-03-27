"use client";

import { SakuraSetting, SakuraSettingGroup } from '../_components/setting/setting';
import { MAX_VOLUME } from '../api/player';
import { useSettings } from '../api/settings';

export default function SettingsPage() {
  const scrobble = useSettings(s => s.scrobble);
  const setScrobble = useSettings(s => s.setScrobble);

  const volume = useSettings(s => s.volume);
  const setVolume = useSettings(s => s.setVolume);

  return (
    <>
      <h2>Settings</h2>
      <SakuraSettingGroup>
        <SakuraSetting name={"Scrobble to server"} body={"Must be configured in your Navidrome server"} value={scrobble} onChange={setScrobble} />
      </SakuraSettingGroup>
      <SakuraSettingGroup>
        <SakuraSetting name={"Audio volume"} value={volume} onChange={setVolume} max={MAX_VOLUME} />
      </SakuraSettingGroup>
    </>
  )
}