import {Config} from 'remotion';

const CopyPlugin = require("copy-webpack-plugin");

Config.Rendering.setImageFormat("png");
Config.Output.setPixelFormat("yuva444p10le");
Config.Output.setCodec("prores");
Config.Output.setProResProfile("4444");

Config.Bundling.overrideWebpackConfig((currentConfiguration) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  currentConfiguration.plugins!.push(
    new CopyPlugin({
      patterns: [{ from: "node_modules/canvaskit-wasm/bin/canvaskit.wasm" }],
    })
  );
  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...(currentConfiguration.module?.rules ?? []),
        // Add more loaders here
      ],
    },
  };
});
