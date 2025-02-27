import * as React from 'react';
import Svg, { Rect, Defs, Pattern, Use, Image } from 'react-native-svg';
const WaterDropIcon = ({ width = 31, height = 31 }: IconProps) => (
    <Svg width={31} height={31} viewBox={`0 0 ${width} ${height}`} fill="none">
    <Rect
      x={0.5}
      y={0.5}
      width={30}
      height={30}
      fill="url(#pattern0_275_171)"
    />
    <Defs>
      <Pattern
        id="pattern0_275_171"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#image0_275_171" transform="scale(0.01)" />
      </Pattern>
      <Image
        id="image0_275_171"
        width={100}
        height={100}
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
);
export default WaterDropIcon;
