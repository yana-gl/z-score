import { type IExtendedPoint } from "../interfaces/iExtendedPoint";

interface GradientStopsProps {
	data: IExtendedPoint[];
	isOutKey: 'isOutPvZ' | 'isOutUvZ';
	color: string;
}

const outColor = "red";

export const GradientStops = ({ data, isOutKey, color }: GradientStopsProps) => {
  const n = data.length - 1;

  return (
    <>
      {data.map((d, i) => {
        const offset = (i / n) * 100;
        const curr = d[isOutKey] ? outColor : color;

        if (i === 0 || i === n) {
          return (
            <stop
              key={i}
              offset={`${offset}%`}
              stopColor={curr}
            />
          );
        }

        const prev = data[i - 1][isOutKey] ? outColor : color;
        return (
          <>
            <stop offset={`${offset}%`} stopColor={prev} />
            <stop offset={`${offset}%`} stopColor={curr} />
          </>
        );
      })}
    </>
  );
};
