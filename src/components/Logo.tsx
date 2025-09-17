import { View } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  Path,
  Text as SvgText,
} from 'react-native-svg';

interface TummyAILogoProps {
  width?: number;
  height?: number;
}

const TummyAILogo: React.FC<TummyAILogoProps> = ({
  width = 160,
  height = 40,
}) => {
  return (
    <View>
      <Svg width={width} height={height} viewBox="0 0 160 40">
        {/* Icon */}
        <G transform="translate(5, 7.5)">
          <Ellipse
            cx="12.5"
            cy="12.5"
            rx="10"
            ry="9"
            fill="#FFE4D6"
            stroke="#FFB5A3"
            strokeWidth="1"
          />
          <Ellipse
            cx="12.5"
            cy="12.5"
            rx="7"
            ry="6"
            fill="#FFD4C4"
            opacity="0.8"
          />
          <Circle cx="8" cy="9" r="1" fill="#FF9A8B" opacity="0.9" />
          <Circle cx="17" cy="11" r="1" fill="#FF9A8B" opacity="0.9" />
          <Circle cx="10" cy="16" r="0.8" fill="#FFC3B8" opacity="0.8" />
          <Circle cx="16" cy="15" r="0.8" fill="#FFC3B8" opacity="0.8" />
          <Path
            d="M 9 14 Q 12.5 17 16 14"
            stroke="#FF8A75"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </G>
        {/* Text */}
        <SvgText
          x="40"
          y="28"
          fontFamily="Arial, sans-serif"
          fontSize="18"
          fontWeight="300"
          fill="#FF8A75"
          letterSpacing="0.5"
        >
          tummy ai
        </SvgText>
      </Svg>
    </View>
  );
};

export { TummyAILogo };
