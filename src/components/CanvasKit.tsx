import { useState, useEffect } from 'react';
import CanvasKitInit, {CanvasKit} from "canvaskit-wasm";
import { createContext, ReactNode, useContext } from "react";

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