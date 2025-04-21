import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const ExitIcon = ({ width = 48, height = 48, fill = '#696969' }: IconProps) => (
  <Svg viewBox="0 0 30 30" width={width} height={height} fill={fill}>
    <Path d="M 5 3 L 5 29 L 23 29 L 23 23.1875 L 21.90625 22.125 L 21.0625 21.25 L 21 21.25 L 21 27 L 7 27 L 7 5 L 21 5 L 21 10.8125 L 21.90625 9.875 L 23 8.8125 L 23 3 Z M 23.34375 11.28125 L 21.90625 12.71875 L 24.1875 15 L 12 15 L 12 17 L 24.1875 17 L 21.90625 19.28125 L 23.34375 20.71875 L 27.34375 16.71875 L 28.03125 16 L 27.34375 15.28125 Z" />
  </Svg>
);
export default ExitIcon;
