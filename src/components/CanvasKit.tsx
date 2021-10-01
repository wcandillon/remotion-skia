import CanvasKitInit, {Canvas, CanvasKit, Surface} from 'canvaskit-wasm';
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {useVideoConfig} from 'remotion';

interface Skia {
  surface: Surface;
  canvas: Canvas;
} 

type DrawCallback = (CanvasKit: CanvasKit, canvas: Canvas) => void;

interface CanvasKitViewProps {
	onDraw: DrawCallback;
}

export const useDrawCallback = (
	cb: DrawCallback,
	deps: Parameters<typeof useCallback>[1]
  // eslint-disable-next-line react-hooks/exhaustive-deps
) => useCallback(cb, deps);

export const CanvasKitView = ({onDraw}: CanvasKitViewProps) => {
	const {width, height} = useVideoConfig();
	const ref = useRef<HTMLCanvasElement>(null);
	const [CanvasKit, setCanvaskit] = useState<null | CanvasKit>(null);
	useEffect(() => {
		CanvasKitInit().then((ck) => {
			setCanvaskit(ck);
		});
	}, []);

	const [skia, setSkia] = useState<Skia | null>(null);

	useEffect(() => {
		if (CanvasKit && ref.current) {
			const surface = CanvasKit.MakeWebGLCanvasSurface(ref.current);
			if (!surface) {
				throw 'Could not make surface';
			}
			setSkia({
				surface,
				canvas: surface.getCanvas(),
			});
		}
	}, [CanvasKit]);

	useEffect(() => {
		if (!CanvasKit || !skia) {
			return;
		}
		const {canvas, surface} = skia;
		const t0 = performance.now();
		onDraw(CanvasKit, canvas);
		surface.flush();
		const t1 = performance.now();
		console.log('time to draw', Math.round(t1 - t0));
	}, [CanvasKit, onDraw, skia]);
	return <canvas ref={ref} width={width} height={height} />;
};
