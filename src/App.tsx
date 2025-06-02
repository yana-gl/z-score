/* eslint-disable @typescript-eslint/no-explicit-any */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { average, averageDeviation, outValue, zScore } from "./utils/math";
import { data } from "./data/data";
import { GradientStops } from "./components/gradientStops";
import { Dot } from "./components/dot";
import type { ExtendedPoint } from "./interfaces/extendedPoint";
import { chartWidth, margin, pvColor, uvColor } from "./data/variables";

const pvAv = average(data.map(it => it.pv));
const pvAvDev = averageDeviation(data.map(it => it.pv), pvAv);
const outPvPositive = outValue(pvAvDev, 1, pvAv);
const outPvNegative = outValue(pvAvDev, -1, pvAv);

const uvAv = average(data.map(it => it.uv));
const uvAvDev = averageDeviation(data.map(it => it.uv), uvAv);
const outUvPositive = outValue(uvAvDev, 1, uvAv);
const outUvNegative = outValue(uvAvDev, -1, uvAv);

const extendedData: ExtendedPoint[] = data.map(it => ({
  ...it,
  pvZ: zScore(it.pv, pvAv, pvAvDev),
  isOutPvZ : Math.abs(zScore(it.pv, pvAv, pvAvDev)) > 1,
  uvZ: zScore(it.uv, uvAv, uvAvDev),
  isOutUvZ : Math.abs(zScore(it.uv, uvAv, uvAvDev)) > 1,
}));

const PvDot = (p: any) => <Dot
	{...p}
	isOutKey="isOutPvZ"
	color={pvColor}
/>;

const UvDot = (p: any) => <Dot
	{...p}
	isOutKey="isOutUvZ"
	color={uvColor}
/>;

export default function App() {
	const size = `${chartWidth}px`;
	return (
		<ResponsiveContainer width="100%" height="100%" minWidth="600px" minHeight={size}>
			<LineChart
				width={chartWidth}
				height={chartWidth}
				data={extendedData}
				margin={margin}
			>
				<defs>
					<linearGradient id="pvGradient" x1="0" y1="0" x2="100%" y2="0">
						<GradientStops
							data={extendedData}
							isOutKey={'isOutPvZ'}
							color={pvColor}
							valueKey="pv"
							outValuePositive={outPvPositive}
							outValueNegative={outPvNegative}
						/>
					</linearGradient>
					<linearGradient id="uvGradient" x1="0" y1="0" x2="100%" y2="0">
						<GradientStops
							data={extendedData}
							isOutKey={'isOutUvZ'}
							color={'#82ca9d'}
							valueKey="uv"
							outValuePositive={outUvPositive}
							outValueNegative={outUvNegative}
						/>
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" padding={{ left: 20, right: 20 }} />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="pv"
					stroke="url(#pvGradient)"
					dot={PvDot}
					activeDot={(p: any) => <PvDot {...p} r={8}/>}
				/>
				<Line
					type="monotone"
					dataKey="uv"
					stroke="url(#uvGradient)"
					dot={UvDot}
					activeDot={(p: any) => <UvDot {...p} r={8}/>}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
