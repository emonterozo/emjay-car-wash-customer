import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const QRCodeIcon = ({ width = 48, height = 48, fill = '#696969' }: IconProps) => (
  <Svg viewBox="0 0 25 25" width={width} height={height} fill={fill}>
    <Path d="M 3 3 L 3 9 L 9 9 L 9 3 L 3 3 z M 11 3 L 11 5 L 13 5 L 13 3 L 11 3 z M 15 3 L 15 9 L 21 9 L 21 3 L 15 3 z M 5 5 L 7 5 L 7 7 L 5 7 L 5 5 z M 17 5 L 19 5 L 19 7 L 17 7 L 17 5 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 3 11 L 3 13 L 5 13 L 5 11 L 3 11 z M 7 11 L 7 13 L 9 13 L 9 11 L 7 11 z M 11 11 L 11 13 L 13 13 L 13 11 L 11 11 z M 13 13 L 13 15 L 15 15 L 15 13 L 13 13 z M 15 13 L 17 13 L 17 11 L 15 11 L 15 13 z M 17 13 L 17 15 L 19 15 L 19 13 L 17 13 z M 19 13 L 21 13 L 21 11 L 19 11 L 19 13 z M 19 15 L 19 17 L 21 17 L 21 15 L 19 15 z M 19 17 L 17 17 L 17 19 L 19 19 L 19 17 z M 19 19 L 19 21 L 21 21 L 21 19 L 19 19 z M 17 19 L 15 19 L 15 21 L 17 21 L 17 19 z M 15 19 L 15 17 L 13 17 L 13 19 L 15 19 z M 13 19 L 11 19 L 11 21 L 13 21 L 13 19 z M 13 17 L 13 15 L 11 15 L 11 17 L 13 17 z M 15 17 L 17 17 L 17 15 L 15 15 L 15 17 z M 3 15 L 3 21 L 9 21 L 9 15 L 3 15 z M 5 17 L 7 17 L 7 19 L 5 19 L 5 17 z" />
  </Svg>
);
export default QRCodeIcon;
