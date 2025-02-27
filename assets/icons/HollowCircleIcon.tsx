import React from 'react';
import Svg, { Circle } from 'react-native-svg';

const HollowCircleIcon = () => {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Circle cx={6} cy={6} r={5} stroke="#00A6ED" strokeWidth={2} />
    </Svg>
  );
};

export default HollowCircleIcon;
