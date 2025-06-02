/* eslint-disable @typescript-eslint/no-explicit-any */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { average, averageDeviation, outValue, zScore } from "./utils/math";
import { data } from "./data/data";
import { GradientStops } from "./components/gradientStops";
import { type IExtendedPoint } from "./interfaces/iExtendedPoint";
import { Dot } from "./components/dot";

const pvAv = average(data.map(it => it.pv));
const pvAvDev = averageDeviation(data.map(it => it.pv), pvAv);

const uvAv = average(data.map(it => it.uv));
const uvAvDev = averageDeviation(data.map(it => it.uv), uvAv);

const extendedData: IExtendedPoint[] = data.map(it => ({
  ...it,
  pvZ: zScore(it.pv, pvAv, pvAvDev),
  isOutPvZ : Math.abs(zScore(it.pv, pvAv, pvAvDev)) > 1,
  uvZ: zScore(it.uv, uvAv, uvAvDev),
  isOutUvZ : Math.abs(zScore(it.uv, uvAv, uvAvDev)) > 1,
}));

window.console.log(extendedData);
// window.console.log(outValue(pvAvDev, 1, pvAv));
// window.console.log(outValue(pvAvDev, -1, pvAv));

// for (let i = 0; i < 10000; i+=100) {
// 	window.console.log(i);
// 	window.console.log(zScore(i, pvAv, pvAvDev));
// }

const PvDot = (p: any) => <Dot
	{...p}
	isOutKey="isOutPvZ"
	color="#8884d8"
/>;

const UvDot = (p: any) => <Dot
	{...p}
	isOutKey="isOutUvZ"
	color="#82ca9d"
/>;

export default function App() {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth="600px" minHeight="600px">
		<LineChart
			width={500}
			height={300}
			data={extendedData}
			margin={{
				top: 5,
				right: 30,
				left: 20,
				bottom: 5,
			}}
		>
			<defs>
				<linearGradient id="pvGradient" x1="0" y1="0" x2="100%" y2="0">
					<GradientStops
						data={extendedData}
						isOutKey={'isOutPvZ'}
						color={'#8884d8'}
					/>
				</linearGradient>
				{/* <linearGradient id="uvGradient" x1="0" y1="0" x2="100%" y2="0">
					<GradientStops
						data={extendedData}
						isOutKey={'isOutUvZ'}
						color={'#82ca9d'}
					/>
				</linearGradient> */}
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
			{/* <Line
				type="monotone"
				dataKey="uv"
				stroke="url(#uvGradient)"
				dot={UvDot}
				activeDot={(p: any) => <UvDot {...p} r={8}/>}
			/> */}
		</LineChart>
    </ResponsiveContainer>
  );
}
