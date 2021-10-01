import {Composition} from 'remotion';

import {HelloWorld} from './HelloWorld';
import {CanvasKitProvider} from "./components/CanvasKit";

const HelloWorldWrapper = () => (
	<CanvasKitProvider>
		<HelloWorld />
	</CanvasKitProvider>
)

export const RemotionVideo: React.FC = () => {
	return (
		<Composition
			id="HelloWorld"
			component={HelloWorldWrapper}
			durationInFrames={100}
			fps={30}
			width={1920}
			height={1080}
			defaultProps={{
					titleText: 'Welcome to Remotion',
					titleColor: 'black',
			}}
			/>
	);
};
