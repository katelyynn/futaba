import { Slider } from 'radix-ui';
import styles from "./slider.module.css";
import { SakuraTooltip } from '../tooltip/tooltip';
import { parseDuration } from '@/app/tools/duration';

interface SakuraSliderProps {
  className?: string,
  showTooltip?: boolean,
  value: number,
  onChange: (v: number) => void,
  min?: number,
  max?: number,
  step?: number
}

export function SakuraSlider({
  className,
  showTooltip = true,
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
    <SakuraTooltip content={min == 0 && max == 1 ? `${Math.round(value * 100)}%` : parseDuration(value)}>
      {slider}
    </SakuraTooltip>
  )
}