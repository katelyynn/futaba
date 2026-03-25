"use client";

import { SakuraSetting, SakuraSettingGroup } from '../_components/setting/setting';
import { useSettings } from '../api/settings';

export default function SettingsPage() {
  const scrobble = useSettings(s => s.scrobble);
  const setScrobble = useSettings(s => s.setScrobble);

  return (
    <>
      <h2>Settings</h2>
      <SakuraSettingGroup>
        <SakuraSetting name={"Scrobble to server"} body={"Must be configured in your Navidrome server"} value={scrobble} onChange={setScrobble} />
        <SakuraSetting name={"Scrobble to server"} body={"Must be configured in your Navidrome server"} value={scrobble} onChange={setScrobble} />
        <SakuraSetting name={"Scrobble to server"} body={"Must be configured in your Navidrome server"} value={scrobble} onChange={setScrobble} />
      </SakuraSettingGroup>
    </>
  )
}