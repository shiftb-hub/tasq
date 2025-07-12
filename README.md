## セットアップ手順

### 1. リポジトリのクローン

```
git clone https://github.com/shiftb-hub/tasq.git
cd tasq
```

上記でクローンすると、カレントフォルダのなかに `tasq` というフォルダが新規作成されて展開されます。別名にしたいときは、たとえば `hoge` というフォルダにクローンしたいときは、次のようにしてください。

```
git clone https://github.com/shiftb-hub/tasq.git hoge
cd hoge
```

### 2. 依存関係のインストール

```bash
npm i
```

### 3. 開発用の環境変数の設定ファイル (.env) の作成

プロジェクトのルートフォルダに `.env` (環境変数の設定ファイル) を新規作成して以下の内容を記述してください。

```
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000/

DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb.....

SB_SERVICE_ROLE_KEY=eyJhb.....
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` と `SB_SERVICE_ROLE_KEY` は、[tasq-sb-dev](https://github.com/shiftb-hub/tasq-sb-dev) で `npx supabase start` を実行して取得したものを設定してください。

### 4. データベースの初期化

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### 5. 開発サーバの起動

```bash
npm run dev
```

### 6. ビルドと実行

```bash
npm run build
npm run start
```

- データベースの状態確認

```bash
npx prisma studio
```

