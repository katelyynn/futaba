"use client";

import { SakuraSetting, SakuraSettingGroup } from '../_components/setting/setting';
import { MAX_VOLUME } from '../api/player';
import { useSettings } from '../api/settings';

export default function SettingsPage() {
  const theme = useSettings(s => s.theme);
  const setTheme = useSettings(s => s.setTheme);

  const scrobble = useSettings(s => s.scrobble);
  const setScrobble = useSettings(s => s.setScrobble);

  const volume = useSettings(s => s.volume);
  const setVolume = useSettings(s => s.setVolume);

  const colourFromNowPlaying = useSettings(s => s.colourFromNowPlaying);
  const setColourFromNowPlaying = useSettings(s => s.setColourFromNowPlaying);

  const hue = useSettings(s => s.hue);
  const setHue = useSettings(s => s.setHue);
  const sat = useSettings(s => s.sat);
  const setSat = useSettings(s => s.setSat);
  const lit = useSettings(s => s.lit);
  const setLit = useSettings(s => s.setLit);

  return (
    <>
      <h2>Settings</h2>
      <SakuraSettingGroup>
        <SakuraSetting name={"Interface theme"} value={theme} values={{
          "light": "Light",
          "dark": "Ash",
          "darker": "Dark",
          "oled": "Void"
        }} onChange={setTheme} type="select" />
        <SakuraSetting name={"Change accent colour based on now playing"} body={"Picks a primary colour from your now playing album cover"} value={colourFromNowPlaying} onChange={setColourFromNowPlaying} />
        <SakuraSetting name={"Accent colour"} value={hue} onChange={setHue} max={360} showSliderTooltipAs="raw" />
        <SakuraSetting name={"Vibrancy"} value={sat} onChange={setSat} max={3} showSliderTooltipAs="raw" />
        <SakuraSetting name={"Lightness"} value={lit} onChange={setLit} max={2} showSliderTooltipAs="raw" />
      </SakuraSettingGroup>
      <SakuraSettingGroup>
        <SakuraSetting name={"Scrobble to server"} body={"Must be configured in your Navidrome server"} value={scrobble} onChange={setScrobble} />
      </SakuraSettingGroup>
      <SakuraSettingGroup>
        <SakuraSetting name={"Audio volume"} value={volume} onChange={setVolume} max={MAX_VOLUME} showSliderTooltipAs="percent" />
      </SakuraSettingGroup>
    </>
  )
}
