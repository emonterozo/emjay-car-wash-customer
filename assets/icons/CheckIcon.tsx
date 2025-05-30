import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const CheckIcon = ({ width = 26, height = 26, fill = '#016FB9' }: IconProps) => (
  <Svg viewBox={`0 0 ${width + 6} ${height + 6}`} width={width} height={height}>
    <Path
      fill={fill}
      d="M22.567,4.73l-1.795-1.219c-0.495-0.334-1.173-0.205-1.507,0.287l-8.787,12.959l-4.039-4.039  c-0.422-0.42-1.11-0.42-1.533,0l-1.533,1.536c-0.424,0.423-0.424,1.11,0,1.534L9.582,22c0.349,0.347,0.895,0.615,1.387,0.615  s0.988-0.31,1.307-0.774L22.856,6.235C23.191,5.743,23.062,5.066,22.567,4.73z"
    />
  </Svg>
);
export default CheckIcon;
