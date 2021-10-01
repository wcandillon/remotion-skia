
import {useCurrentFrame} from 'remotion'
import {interpolate} from 'remotion'
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
	
	export const canvas2Cartesian = (v: Vector, center: Vector) => {
		return {
			x: v.x - center.x,
			y: -1 * (v.y - center.y),
		};
	};
	
	export const cartesian2Canvas = (v: Vector, center: Vector) => {
		return {
			x: v.x + center.x,
			y: -1 * v.y + center.y,
		};
	};

	export const cartesian2Polar = (v: Vector) => {
		return {
			theta: Math.atan2(v.y, v.x),
			radius: Math.sqrt(v.x ** 2 + v.y ** 2),
		};
	};
	
	export const polar2Cartesian = (p: PolarPoint) => {
		return {
			x: p.radius * Math.cos(p.theta),
			y: p.radius * Math.sin(p.theta),
		};
	};
	
	export const polar2Canvas = (p: PolarPoint, center: Vector) => {
		return cartesian2Canvas(polar2Cartesian(p), center);
	};
	
	export const canvas2Polar = (v: Vector, center: Vector) => {
		return cartesian2Polar(canvas2Cartesian(v, center));
	};
