import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// バックエンドのサービス層を対象にしたテスト

export default defineConfig({
  plugins: [tsconfigPaths()], // import で @/app/... を使用可能にする
  test: {
    globals: false,
    environment: "node",
    setupFiles: ["dotenv/config", "./tests/setup/prisma.setup.ts"],
    include: ["tests/**/*.spec.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});

// 実行方法1: npm run vitest
// 実行方法2: VSCode拡張機能 `vitest.explorer`
// 実行方法3: npx cross-env dotenv_config_path=.env.test vitest run
