## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/shiftb-hub/tasq.git
cd tasq
```

上記でクローンすると、カレントフォルダのなかに `tasq` というフォルダが新規作成されて展開されます。別名にしたいとき（たとえば `hoge` というフォルダにクローンしたいとき）は、次のようにしてください。

```bash
git clone https://github.com/shiftb-hub/tasq.git hoge
cd hoge
```

### 2. 依存関係のインストール

```bash
npm i
```

### 3. 開発用の環境変数の設定ファイル (.env) の作成

プロジェクトのルートフォルダに `.env` (環境変数の設定ファイル) を新規作成し、以下の内容を記述してください。

```env
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000/

DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb.....

SB_SERVICE_ROLE_KEY=eyJhb.....
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` と `SB_SERVICE_ROLE_KEY` は、[tasq-sb-dev](https://github.com/shiftb-hub/tasq-sb-dev) で `npx supabase start` を実行したときに表示される値を設定してください。

### 4. テスト用の環境変数の設定ファイル (.env.test) の作成

プロジェクトのルートフォルダに `.env.test` (Vitest実行時に参照する環境変数の設定ファイル) を新規作成し、以下の内容を記述してください。

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### 5. データベースの初期化

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### 6. 開発サーバの起動

```bash
npm run dev
```

### 7. ビルドと実行

```bash
npm run build
npm run start
```

- データベースの状態確認

```bash
npx prisma studio
```

### 8. テストの実行（Vitestの実行）

```bash
npm run test
```

VSCodeの拡張機能の [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer)（識別子: `vitest.explorer`）からも実行できます。

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: [Next.js 15](https://nextjs.org/) (App Router)
- **スタイリング**: [TailwindCSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)

- **バージョン管理**: Git, GitHub (organization)
- **CI/CD**: GitHub Actions
- **AIコードレビュー**: [CodeRabbit](https://www.coderabbit.ai/ja)🐰
- **デザインカンプ**: [Figma](https://www.figma.com/ja-jp/)
- **記録**: Notion
- **コミュニケーション**: [Teracy](https://teracy.io/ja/), Slack