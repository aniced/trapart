import { defineConfig, type PluginOption } from 'vite'
import solid from 'vite-plugin-solid'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    solid(),
    visualizer({
      emitFile: true,
      filename: 'bundle.html',
    }) as PluginOption,
  ],
  build: {
    target: 'esnext',
  },
  // resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
})
