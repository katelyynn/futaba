import { Slider } from 'radix-ui';
import styles from "./slider.module.css";
import { SakuraTooltip } from '@/components/tooltip/tooltip.tsx';
import { parseDuration } from '@/tools/duration.ts';

interface SakuraSliderProps {
  className?: string,
  showTooltip?: boolean,
  showTooltipAs?: "raw" | "time" | "percent",
  value: number,
  onChange: (v: number) => void,
  min?: number,
  max?: number,
  step?: number
}

export function SakuraSlider({
  className,
  showTooltip = true,
  showTooltipAs = "raw",
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01
}: SakuraSliderProps) {
  const slider = (
    <Slider.Root className={`${styles.sliderRoot} ${className && className}`} value={[value]} min={min} max={max} step={step || 0.01} onValueChange={value => onChange(value[0])}>
      <Slider.Track className={styles.sliderTrack}>
        <Slider.Range className={styles.sliderRange} />
      </Slider.Track>
      <Slider.Thumb className={styles.sliderThumb} />
    </Slider.Root>
  );

  if (!showTooltip) return slider;

  return (
    <SakuraTooltip content={showTooltipAsHelper(showTooltipAs, value, min, max)}>
      {slider}
    </SakuraTooltip>
  )
}

export function showTooltipAsHelper(as: "raw" | "time" | "percent", value: number, min: number, max: number) {
  if (as == "percent") {
    return `${Math.round(((value - min) / (max - min)) * 100)}%`;
  }

  if (as == "time") {
    return parseDuration(value);
  }

  return value;
}
