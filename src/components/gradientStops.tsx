import { innerWidth, outColor } from "../data/variables";
import { type IExtendedPoint } from "../interfaces/iExtendedPoint";
import { isInRange } from "../utils/math";
import { GradientStop, type GradientStopProps } from "./gradientStop";

interface GradientStopsProps {
    data: IExtendedPoint[];
    isOutKey: 'isOutPvZ' | 'isOutUvZ';
    valueKey: 'pv' | 'uv';
    color: string;
    outValuePositive: number;
    outValueNegative: number;
}

export const GradientStops = ({ data, isOutKey, valueKey, color, outValuePositive, outValueNegative }: GradientStopsProps) => {
	const minRelevant = Math.min(outValuePositive, outValueNegative);
	const maxRelevant = Math.max(outValuePositive, outValueNegative);
	const n = data.length - 1;
	const transitions: GradientStopProps[] = [];

	function calculateColorTransitionOffset(start: number, end: number, middle: number, index: number) {
		const t = (start - middle) / (start - end);
		const offsetFromStartPoint = t * innerWidth / n;
		const absoluteOffset = ((index - 1) / n * innerWidth) + offsetFromStartPoint;
		return (absoluteOffset / innerWidth) * 100;
	}

	data.forEach((_d, i) => {
		// для первой и последней точек отдаем один <stop/>
		if (i === 0) {
			transitions.push({
				offset: 0,
				color: data[i][isOutKey] ? outColor : color,
			});
		}
		else {
			const start = data[i - 1][valueKey];
			const end = data[i][valueKey];

			if (start < end) {
				if (isInRange(minRelevant, start, end)) {
					const offset = calculateColorTransitionOffset(start, end, minRelevant, i);
					transitions.push(
						{ offset, color: outColor },
						{ offset, color },
					);
				}
				if (isInRange(maxRelevant, start, end)) {
					const offset = calculateColorTransitionOffset(start, end, maxRelevant, i);
					transitions.push(
						{ offset, color },
						{ offset, color: outColor },
					);
				}
			}

			if (start > end) {
				if (isInRange(maxRelevant, start, end)) {
					const offset = calculateColorTransitionOffset(start, end, maxRelevant, i);
					transitions.push(
						{ offset, color: outColor },
						{ offset, color });
				}
				if (isInRange(minRelevant, start, end)) {
					const offset = calculateColorTransitionOffset(start, end, minRelevant, i);
					transitions.push(
						{ offset, color },
						{ offset, color: outColor });
				}
			}
		}
		if (i === n) {
			transitions.push({
				offset: 100,
				color: data[i][isOutKey] ? outColor : color,
			});
		}
	});

	window.console.log(transitions);
	return (<>
		{
			transitions.map((it, index) => <GradientStop key={index} offset={it.offset} color={it.color}/>)
		}
	</>);
};
