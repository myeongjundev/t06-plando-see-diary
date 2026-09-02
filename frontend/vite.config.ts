import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// 개발 중에는 Vite가 /api를 로컬 Flask로 넘긴다. 대상이 5000번으로 고정돼 있으면
// 그 포트를 다른 앱이 쓰고 있을 때 백엔드를 옮길 방법이 없다. T06_API_TARGET으로
// 바꿀 수 있게 하고, 값이 없으면 기존 동작을 그대로 쓴다.
//
//   $env:T06_API_TARGET = "http://127.0.0.1:5055"
//
// loadEnv는 접두사가 맞는 셸 환경변수와 .env 파일을 함께 읽는다. @types/node를
// 새로 들이지 않으려고 process.env 대신 이걸 쓴다.
//
// 개발 서버에만 쓰이며 배포 산출물에는 들어가지 않는다. 배포본은 Flask가 API와
// 정적 파일을 같은 출처에서 함께 서빙하므로 프록시 자체가 없다.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "T06_");
  return {
    plugins: [react()],
    // Serve even small font subsets as same-origin files under the strict CSP.
    build: { assetsInlineLimit: 0 },
    server: {
      port: 5173,
      proxy: {
        "/api": env.T06_API_TARGET || "http://127.0.0.1:5000",
      },
    },
  };
});
