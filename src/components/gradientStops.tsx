import { innerWidth, outColor } from "../data/variables";
import type { ExtendedPoint } from "../interfaces/extendedPoint";
import type { IsOutKey } from "../interfaces/isOutKeyType";
import type { ValueKey } from "../interfaces/valueKeyType";
import { isInRange } from "../utils/math";
import { GradientStop, type GradientStopProps } from "./gradientStop";

interface GradientStopsProps {
    data: ExtendedPoint[];
    isOutKey: IsOutKey;
    valueKey: ValueKey;
    color: string;
    outValuePositive: number;
    outValueNegative: number;
}

export const GradientStops = ({ data, isOutKey, valueKey, color, outValuePositive, outValueNegative }: GradientStopsProps) => {
	// |z-score| между этими точками < 1
	const minRelevant = Math.min(outValuePositive, outValueNegative);
	const maxRelevant = Math.max(outValuePositive, outValueNegative);
	const n = data.length - 1;
	const transitions: GradientStopProps[] = [];

	// возвращает отступ от начала координат до точки middle в отрезке [start; end] в %
	function calculateColorTransitionOffset(start: number, end: number, middle: number, index: number) {
		const ratio = (start - middle) / (start - end);
		const offsetFromStartPoint = ratio * innerWidth / n;
		const absoluteOffset = ((index - 1) / n * innerWidth) + offsetFromStartPoint;
		return (absoluteOffset / innerWidth) * 100;
	}

	data.forEach((_d, i) => {
		if (i === 0) {
			transitions.push({
				offset: 0,
				color: data[i][isOutKey] ? outColor : color,
			});
		}
		// если в отрезках между точками находим minRelevant, maxRelevant, меняем цвет участка графика
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

	return (<>
		{
			transitions.map((it, index) => <GradientStop key={index} offset={it.offset} color={it.color}/>)
		}
	</>);
};
