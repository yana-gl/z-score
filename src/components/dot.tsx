
import { outColor } from "../data/variables";
import { type IExtendedPoint } from "../interfaces/iExtendedPoint";
import type { IsOutKey } from "../interfaces/isOutKeyType";

interface DotProps {
    cx?: number;
    cy?: number;
    r?: number;
    payload: IExtendedPoint;
    isOutKey: IsOutKey;
    color: string;
}

export const Dot = ({ cx, cy, payload, r = 4, isOutKey, color }: DotProps) => {
  const newColor = payload[isOutKey] ? outColor : color;
  return <circle cx={cx} cy={cy} r={r} fill={newColor} stroke="white"/>;
};
