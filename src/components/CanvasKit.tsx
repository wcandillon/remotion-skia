import {useVideoConfig} from 'remotion'
import { useState, useEffect, useCallback } from 'react';
import CanvasKitInit, {CanvasKit, Canvas} from "canvaskit-wasm";
import { createContext, ReactNode, useContext } from "react";
import {continueRender, delayRender} from 'remotion';

export type CanvasKitContext = null | CanvasKit;

const CanvasKitContext = createContext<CanvasKitContext>(null);

export const useCanvasKit = () => {
  const canvaskit = useContext(CanvasKitContext); 
  return canvaskit;
}

interface CanvasKitProviderProps {
  children: ReactNode | ReactNode[];
}

export const CanvasKitProvider = ({children}: CanvasKitProviderProps) => {
  const [canvaskit, setCanvaskit] = useState<CanvasKitContext>(null);
  useEffect(() => {
    CanvasKitInit().then(ck => {
      setCanvaskit(ck);
    });
  }, []);
  return (
	<CanvasKitContext.Provider value={canvaskit}>
		{children}
	</CanvasKitContext.Provider>
  )
};

type DrawCallback = (CanvasKit: CanvasKit, canvas: Canvas) => void

interface CanvasKitViewProps {
  onDraw: DrawCallback;
}

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useDrawCallback = (cb: DrawCallback, deps: Parameters<typeof useCallback>[1]) => useCallback(cb, deps);

export const CanvasKitView = ({onDraw}: CanvasKitViewProps) => {
  const {width,height} = useVideoConfig();
  const CanvasKit = useCanvasKit();
	useEffect(() => {
		if (CanvasKit) {
			const surface = CanvasKit.MakeCanvasSurface("canvas");
			if (!surface) {
				throw "Could not make surface";
			}
			const canvas = surface.getCanvas();
      const t0 = performance.now();
      onDraw(CanvasKit, canvas);
      const t1 = performance.now();
      surface.flush();
    }
  }, [CanvasKit, onDraw]);
  return (
	  <canvas id="canvas" width={width} height={height} />
  );
}