export function average(array: number[]) {
    return array.reduce((acc, curr) => acc + curr)/array.length;
}

// Сумма квадратов отклонений
export function squaredDeviationsSum(array: number[], av: number) {
    return array.reduce((acc, curr) => acc + Math.pow(curr - av, 2));
}

// Стандартное отклонение
export function averageDeviation(array: number[], av: number) {
    return Math.sqrt(squaredDeviationsSum(array, av)/array.length);
}

export function zScore(x: number, av: number, devAv: number) {
    return (x - av) / devAv;
}

export function outValue(devAv: number, z: number, av: number) {
    return devAv * z + av;
}

export function isInRange(value: number, start: number, end: number): boolean {
	const min = Math.min(start, end);
	const max = Math.max(start, end);
	return value >= min && value <= max;
}
