import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  devServer: {
    hot: true, // HMR 활성화
    liveReload: false, // Live reload 비활성화
    static: {
      watch: false, // 파일 감시 비활성화
    },
  },
})
