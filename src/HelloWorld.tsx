import {interpolate} from 'remotion'
import { useEffect } from 'react';
import { useCanvasKit } from './components/CanvasKit';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const toDeg = (rad: number) => (rad * 180) / Math.PI;

export interface Vector {
  x: number;
  y: number;
}

export const mix = (value: number, x: number, y: number) =>
  x * (1 - value) + y * value;

	export const useLoop = (
		durationInFrames = 15,
		boomerang = true,
		startsAtFrame = 0
	) => {
		const frame = Math.max(useCurrentFrame() - startsAtFrame, 0);
		// Number of frames in the current iteration
		const progress = interpolate(
			frame % durationInFrames,
			[0, durationInFrames],
			[0, 1]
		);
		// If the current iteration is even
		// then we are going back from 1 to 0
		const currentIteration = Math.floor(frame / durationInFrames);
		const isGoingBack = currentIteration % 2 === 0;
		// if we are going back, we invert the progress
		return isGoingBack && boomerang ? 1 - progress : progress;
	};
	export interface PolarPoint {
		theta: number;
		radius: number;
	}
	
	/**
	 * @worklet
	 */
	export const canvas2Cartesian = (v: Vector, center: Vector) => {
		"worklet";
		return {
			x: v.x - center.x,
			y: -1 * (v.y - center.y),
		};
	};
	
	/**
	 * @worklet
	 */
	export const cartesian2Canvas = (v: Vector, center: Vector) => {
		"worklet";
		return {
			x: v.x + center.x,
			y: -1 * v.y + center.y,
		};
	};
	
	/**
	 * @worklet
	 */
	export const cartesian2Polar = (v: Vector) => {
		"worklet";
		return {
			theta: Math.atan2(v.y, v.x),
			radius: Math.sqrt(v.x ** 2 + v.y ** 2),
		};
	};
	
	/**
	 * @worklet
	 */
	export const polar2Cartesian = (p: PolarPoint) => {
		"worklet";
		return {
			x: p.radius * Math.cos(p.theta),
			y: p.radius * Math.sin(p.theta),
		};
	};
	
	/**
	 * @worklet
	 */
	export const polar2Canvas = (p: PolarPoint, center: Vector) => {
		"worklet";
		return cartesian2Canvas(polar2Cartesian(p), center);
	};
	
	/**
	 * @worklet
	 */
	export const canvas2Polar = (v: Vector, center: Vector) => {
		"worklet";
		return cartesian2Polar(canvas2Cartesian(v, center));
	};

	
export const HelloWorld = () => {
	const {width, height} = useVideoConfig();
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
		}
	}, [CanvasKit, frame, height, width]);
	return (
		<canvas id="canvas" width={width} height={height} />
	);
};