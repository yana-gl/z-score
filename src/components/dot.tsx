
import { outColor } from "../data/variables";
import type { ExtendedPoint } from "../interfaces/extendedPoint";
import type { IsOutKey } from "../interfaces/isOutKeyType";

interface DotProps {
    cx?: number;
    cy?: number;
    r?: number;
    payload: ExtendedPoint;
    isOutKey: IsOutKey;
    color: string;
}

export const Dot = ({ cx, cy, payload, r = 4, isOutKey, color }: DotProps) => {
  const newColor = payload[isOutKey] ? outColor : color;
  return <circle cx={cx} cy={cy} r={r} fill={newColor} stroke="white"/>;
};
