import { type IExtendedPoint } from "../interfaces/iExtendedPoint";
import { average, averageDeviation, outValue } from "../utils/math";

interface GradientStopsProps {
    data: IExtendedPoint[];
    isOutKey: 'isOutPvZ' | 'isOutUvZ';
    color: string;
}

const outColor = "red";
const chartWidth = 600;
const margin = { left: 20, right: 30 };
const innerWidth = chartWidth - margin.left - margin.right; 

function isInRange(value: number, start: number, end: number): boolean {
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  return value >= min && value <= max;
}

export const GradientStops = ({ data, isOutKey, color }: GradientStopsProps) => {
	const pvAv = average(data.map(it => it.pv));
	const pvAvDev = averageDeviation(data.map(it => it.pv), pvAv);
	const outPvPositive = outValue(pvAvDev, 1, pvAv);
	const outPvNegative = outValue(pvAvDev, -1, pvAv);
	const minRelevantPv = Math.min(outPvPositive, outPvNegative);
	const maxRelevantPv = Math.max(outPvPositive, outPvNegative);
	const n = data.length - 1;
	const isOut = data[0][isOutKey];
 
  return (
		<>
		{data.map((d, i) => {
			// отступ до перебираемой точки
			// но нам нужна критическая точка
			let offset = (i / n) * 100;

			// let curr = d[isOutKey] ? outColor : color;

			if (i === 0 || i === n) {
			return (
				<stop
				key={i}
				offset={`${offset}%`}
				stopColor={isOut ? outColor : color}
				/>
			);
			}

			window.console.log('pair: ', data[i - 1], data[i]);
			if (data[i - 1].pv < data[i].pv) {
				let GradientStop1 = <></>;
				let GradientStop2 = <></>;
				if (isInRange(minRelevantPv, data[i - 1].pv, data[i].pv)) {
					const t = (data[i - 1].pv - minRelevantPv) / (data[i - 1].pv - data[i].pv);
					const pixelOffset = t * innerWidth / n;
					const pixelAbsolute = ((i-1)/n * innerWidth) + pixelOffset;
					offset = (pixelAbsolute / innerWidth) * 100;
					window.console.log(offset);

					GradientStop1 = (<>
						<stop offset={`${offset}%`} stopColor={outColor} />
						<stop offset={`${offset}%`} stopColor={color} />
					</>);
				}
				if (isInRange(maxRelevantPv, data[i - 1].pv, data[i].pv)) {
					const t = (data[i - 1].pv - maxRelevantPv) / (data[i - 1].pv - data[i].pv);
					const pixelOffset = t * innerWidth / n;
					const pixelAbsolute = ((i-1)/n * innerWidth) + pixelOffset;
					offset = (pixelAbsolute / innerWidth) * 100;
					window.console.log(offset);

					GradientStop2 = (<>
						<stop offset={`${offset}%`} stopColor={color} />
						<stop offset={`${offset}%`} stopColor={outColor} />
					</>);
				}

				return (
					<>
						{GradientStop1}
						{GradientStop2}
					</>
				);
			}
			if (data[i - 1].pv > data[i].pv) {
				let GradientStop3 = <></>;
				let GradientStop4 = <></>;
				if (isInRange(maxRelevantPv, data[i - 1].pv, data[i].pv)) {
					const t = (data[i - 1].pv - maxRelevantPv) / (data[i - 1].pv - data[i].pv);
					const pixelOffset = t * innerWidth / n;
					const pixelAbsolute = ((i-1)/n * innerWidth) + pixelOffset;
					offset = (pixelAbsolute / innerWidth) * 100;
					window.console.log(offset);

					GradientStop3 = (<>
						<stop offset={`${offset}%`} stopColor={outColor} />
						<stop offset={`${offset}%`} stopColor={color} />
					</>
					);
				}
				if (isInRange(minRelevantPv, data[i - 1].pv, data[i].pv)) {
					const t = (data[i - 1].pv - minRelevantPv) / (data[i - 1].pv - data[i].pv);
					const pixelOffset = t * innerWidth / n;
					const offsetFromPageStart = ((i-1)/n * innerWidth);
					const pixelAbsolute = offsetFromPageStart + pixelOffset;
					offset = (pixelAbsolute / innerWidth) * 100;
					window.console.log(offset);

					GradientStop4 = (<>
						<stop offset={`${offset}%`} stopColor={color} />
						<stop offset={`${offset}%`} stopColor={outColor} />
					</>);
				}
				return (
					<>
						{GradientStop3}
						{GradientStop4}
					</>
				);
			}
		})}
		</>
	);
};
