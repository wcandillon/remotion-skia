import {useState} from 'react'
import {interpolate} from 'remotion'
import { useEffect } from 'react';
import { useCanvasKit } from './components/CanvasKit';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {continueRender, delayRender} from 'remotion'
import { useLoop, toDeg, mix, polar2Canvas } from './components/Helpers';

	
export const HelloWorld = () => {
	const {width, height} = useVideoConfig();
	const [handle] = useState(() => delayRender())
	const frame = useCurrentFrame();
	const CanvasKit = useCanvasKit();
	const center = { x: width/2, y: height/2 };
	const progress = useLoop(30 * 3, true);
	useEffect(() => {
		if (CanvasKit) {
			const surface = CanvasKit.MakeCanvasSurface("canvas");
			if (!surface) {
				throw "Could not make surface";
			}
			const canvas = surface.getCanvas();
			const c1 = CanvasKit.parseColorString("#61bea2");
			const c2 = CanvasKit.parseColorString("#529ca0");
			const paint = new CanvasKit.Paint();
			paint.setBlendMode(CanvasKit.BlendMode.Screen);
			canvas.save();
			canvas.translate(center.x, center.y);
			canvas.rotate(toDeg(mix(progress, -Math.PI, 0)), 0, 0);
			canvas.translate(-center.x, -center.y);
			const SIZE = width / 2;
			new Array(6).fill(0).map((_, index) => {
				const theta = (index * (2 * Math.PI)) / 6;
				const { x, y } = polar2Canvas(
					{ theta, radius: SIZE / 2 },
					{ x: 0, y: 0 }
				);
				const translateX = mix(progress, 0, x);
				const translateY = mix(progress, 0, y);
				const scale = mix(progress, 0.3, 1);
				paint.setMaskFilter(
					CanvasKit.MaskFilter.MakeBlur
				(
						CanvasKit.BlurStyle.Solid,
						interpolate(progress, [0, 0.5, 1], [0, 45, 30]), false
					)
				);
				paint.setColor(index % 2 ? c1 : c2);
				canvas.save();
				canvas.translate(center.x, center.y);
				canvas.translate(translateX, translateY);
				canvas.scale(scale, scale);
				canvas.translate(-center.x, -center.y);
				canvas.drawCircle(center.x, center.y, SIZE / 2, paint);
				canvas.restore();
			});
			canvas.restore();
			surface.flush();
			continueRender(handle);
		}
	}, [CanvasKit, frame, height, width]);
	return (
		<canvas id="canvas" width={width} height={height} />
	);
};