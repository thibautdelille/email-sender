import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
} from '@chakra-ui/react';

type SliderProps = {
  value: number[];
  onChange: (value: number[]) => void;
  max: number;
};

export const Slider = ({ value, onChange, max }: SliderProps) => {
  return (
    <RangeSlider
      aria-label={['start', 'end']}
      max={max}
      value={value}
      onChange={onChange}
    >
      <RangeSliderTrack>
        <RangeSliderFilledTrack />
      </RangeSliderTrack>
      <RangeSliderThumb index={0} />
      <RangeSliderThumb index={1} />
      <RangeSliderMark
        value={value[0]}
        textAlign="center"
        width="auto"
        mt={2}
        ml={0}
        transform="translate(-50%)"
      >
        {value[0]}
      </RangeSliderMark>
      <RangeSliderMark
        value={value[1]}
        textAlign="center"
        width="auto"
        mt={2}
        ml={0}
        transform="translateX(-50%)"
      >
        {value[1]}
      </RangeSliderMark>
    </RangeSlider>
  );
};
