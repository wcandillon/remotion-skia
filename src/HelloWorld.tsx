import {interpolate, useVideoConfig} from 'remotion';
import {CanvasKitView, useDrawCallback} from './components/CanvasKit';
import {mix, polar2Canvas, toDeg, useLoop} from './components/Helpers';

export const HelloWorld = () => {
	const {width, height} = useVideoConfig();
	const center = {x: width / 2, y: height / 2};
	const progress = useLoop(30 * 3, true);
	const onDraw = useDrawCallback(
		(CanvasKit, canvas) => {
			const paint = new CanvasKit.Paint();

			const prog = `
			uniform float rad_scale;
			uniform float2 in_center;
			uniform float4 in_colors0;
			uniform float4 in_colors1;
			
			half4 main(float2 p) {
					float2 pp = p - in_center;
					float radius = sqrt(dot(pp, pp));
					radius = sqrt(radius);
					float angle = atan(pp.y / pp.x);
					float t = (angle + 3.1415926/2) / (3.1415926);
					t += radius * rad_scale;
					t = fract(t);
					return half4(mix(in_colors0, in_colors1, t));
			}
			
			`;
			
			const fact = CanvasKit.RuntimeEffect.Make(prog);
			canvas.clear(CanvasKit.WHITE);
			const shader = fact.makeShader([
				Math.sin(Date.now() / 2000) / 5,
				width/2, height/2,
				1, 0, 0, 1,
				0, 1, 0, 1],
				true /*=opaque*/);
		
			paint.setShader(shader);
			canvas.drawPaint(paint);
			shader.delete();			
		},
		[center.x, center.y, progress, width]
	);
	return <CanvasKitView onDraw={onDraw} />;
};
