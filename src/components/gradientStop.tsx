export interface GradientStopProps {
    offset: number;
    color: string;
}

export const GradientStop = ({ offset, color }: GradientStopProps) => {
	return (
		<stop offset={`${offset}%`} stopColor={color} />
	);
};
