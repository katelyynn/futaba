"use client";

import { SakuraSetting, SakuraSettingGroup } from '@/components/setting/setting.tsx';
import { MAX_VOLUME } from '@/api/player.ts';
import { useSettings } from '@/api/settings.ts';
import { SettingsTabs } from './tab.tsx';

export function Appearance() {
  const theme = useSettings(s => s.theme);
  const setTheme = useSettings(s => s.setTheme);

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
      <SettingsTabs />
      <SakuraSettingGroup>
        <SakuraSetting name="Interface theme" value={theme} values={{
          "light": "Light",
          "dark": "Ash",
          "darker": "Dark",
          "oled": "Void"
        }} onChange={setTheme} type="select" />
        <SakuraSetting name="Change accent colour based on now playing" body="Picks a primary colour from your now playing album cover" value={colourFromNowPlaying} onChange={setColourFromNowPlaying} />
        <SakuraSetting name="Accent colour" value={hue} onChange={setHue} max={360} showSliderTooltipAs="raw" round />
        <SakuraSetting name="Vibrancy" value={sat} onChange={setSat} max={3} showSliderTooltipAs="raw" />
        <SakuraSetting name="Lightness" value={lit} onChange={setLit} max={2} showSliderTooltipAs="raw" />
      </SakuraSettingGroup>
    </>
  )
}
