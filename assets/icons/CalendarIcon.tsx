import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const CalendarIcon = ({ width = 48, height = 48, fill = '#696969' }: IconProps) => (
  <Svg viewBox="0 0 48 48" width={width} height={height} fill={fill}>
    <Path d="M 12.5 6 C 8.9280619 6 6 8.9280619 6 12.5 L 6 35.5 C 6 39.071938 8.9280619 42 12.5 42 L 35.5 42 C 39.071938 42 42 39.071938 42 35.5 L 42 12.5 C 42 8.9280619 39.071938 6 35.5 6 L 12.5 6 z M 12.5 9 L 35.5 9 C 37.450062 9 39 10.549938 39 12.5 L 39 14 L 9 14 L 9 12.5 C 9 10.549938 10.549938 9 12.5 9 z M 9 17 L 39 17 L 39 35.5 C 39 37.450062 37.450062 39 35.5 39 L 12.5 39 C 10.549938 39 9 37.450062 9 35.5 L 9 17 z M 15.5 21 A 2.5 2.5 0 0 0 15.5 26 A 2.5 2.5 0 0 0 15.5 21 z M 24 21 A 2.5 2.5 0 0 0 24 26 A 2.5 2.5 0 0 0 24 21 z M 32.5 21 A 2.5 2.5 0 0 0 32.5 26 A 2.5 2.5 0 0 0 32.5 21 z M 15.5 30 A 2.5 2.5 0 0 0 15.5 35 A 2.5 2.5 0 0 0 15.5 30 z M 24 30 A 2.5 2.5 0 0 0 24 35 A 2.5 2.5 0 0 0 24 30 z" />
  </Svg>
);
export default CalendarIcon;
