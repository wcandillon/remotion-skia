import { useEffect } from 'react';
import { useCanvasKit } from './components/CanvasKit';
import { useCurrentFrame, useVideoConfig } from 'remotion';


export const HelloWorld = () => {
	const {width, height} = useVideoConfig();
	const frame = useCurrentFrame();
	const CanvasKit = useCanvasKit();
	useEffect(() => {
		if (CanvasKit) {
			const surface = CanvasKit.MakeCanvasSurface("canvas");
			if (!surface) {
				throw "Could not make surface";
			}
			const canvas = surface.getCanvas();
			const shader = CanvasKit.Shader.MakeRadialGradient(
				[width/2, height / 2],
				200,
				[CanvasKit.BLUE, CanvasKit.RED],
				[0, 1],
				CanvasKit.TileMode.Clamp
			);
			const paint = new CanvasKit.Paint();
			canvas.drawColor(CanvasKit.GREEN);
		//	paint.setShader(shader);
			paint.setColor(CanvasKit.RED)
			paint.setAntiAlias(true);
			console.log("drawCircle");
			canvas.drawCircle(width/2, height / 2, 200, paint);
			shader.delete();
			surface.flush();
		}
	}, [CanvasKit, frame, height, width]);
	return (
		<canvas id="canvas" width={width} height={height} />
	);
};