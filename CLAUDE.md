# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

TASQは、Next.js 15とSupabaseを使用したプログラミングスクール向けのタスク管理・学習進捗管理システムです。生徒は自分のタスクを作成・管理し、講師は生徒の進捗をモニタリングできます。

## 技術スタック

- **フレームワーク**: Next.js 15.3.5 (App Router, Turbopack)
- **言語**: TypeScript 5
- **認証**: Supabase Auth
- **データベース**: PostgreSQL (Prisma ORM経由)
- **スタイリング**: Tailwind CSS v4
- **UIコンポーネント**: Radix UI, shadcn/ui
- **フォーム**: React Hook Form + Zod

## 開発コマンド

```bash
# 開発サーバー起動 (Turbopack使用)
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# Lintチェック
npm run lint

# Prismaコマンド
npx prisma db push      # スキーマをDBに反映
npx prisma generate      # Prismaクライアント生成
npx prisma db seed       # シードデータ投入
npx prisma studio        # DB管理UI起動
```

## ディレクトリ構造とアーキテクチャ

```
src/app/
├── (private)/          # 認証必須のルートグループ
│   ├── api/           # プライベートAPI
│   └── settings/      # ユーザー設定ページ
├── (public)/          # 認証不要のルートグループ
│   ├── api/           # パブリックAPI
│   ├── login/         # ログインページ
│   └── signup/        # サインアップページ
├── _actions/          # Server Actions
├── _components/       # 共通コンポーネント
│   ├── sidebar/       # サイドバー関連
│   └── ui/           # UIプリミティブ (shadcn/ui)
├── _configs/         # アプリケーション設定
├── _hooks/           # カスタムフック
├── _libs/            # ライブラリ・ユーティリティ
│   └── supabase/     # Supabase設定
├── _services/        # ビジネスロジック
└── _types/          # 型定義
```

## 認証フロー

1. **ミドルウェア** (`src/middleware.ts`):
   - すべてのリクエストでSupabaseセッション検証を実行
   - パブリックパス以外は認証が必要
   - `publicPaths`は`app-config.ts`で定義

2. **認証済みユーザー取得**:
   ```typescript
   import { authenticateUser } from "@/app/_libs/authenticateUser";
   const user = await authenticateUser();
   ```

3. **Server Actions**:
   - `loginAction.ts`, `logoutAction.ts`でフォーム送信を処理

## データベース設計

主要モデル:
- **User**: ユーザー情報 (生徒/TA/講師/管理者)
- **Task**: タスク情報
- **Status**: タスクステータス
- **StudyLog**: 学習ログ
- **TeacherStudent**: 講師-生徒関連
- **AssignmentLog**: 講師の対応履歴

## エラーハンドリング

- **AppErrorCodes** (`_types/AppErrorCodes.ts`): アプリケーション共通エラーコード
- **ApiResponse** (`_types/ApiResponse.ts`): API応答の統一フォーマット
- **dumpException** (`_libs/dumpException.ts`): エラーログ出力ユーティリティ

## フォームバリデーション

Zodスキーマを使用した型安全なバリデーション:
- `LoginRequest.ts`: ログインフォーム
- `SignupRequest.ts`: サインアップフォーム
- `ProfileUpdateRequest.ts`: プロフィール更新

## 環境変数

必須の環境変数 (`.env`):
- `NEXT_PUBLIC_APP_BASE_URL`: アプリケーションのベースURL
- `DATABASE_URL`, `DIRECT_URL`: Prisma接続文字列
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase公開キー
- `SB_SERVICE_ROLE_KEY`: Supabaseサービスロールキー

## UIコンポーネント規約

- shadcn/uiコンポーネントは`_components/ui/`に配置
- Radix UIをベースに、Tailwind CSSでスタイリング
- カスタムコンポーネントは機能別にグループ化

## フック使用規約

- `use-mobile`: モバイル判定
- `useAvatarUrl`: アバター画像URL生成
- `useFileDialog`: ファイル選択ダイアログ

## セキュリティ

- Supabase Row Level Security (RLS)で認可制御
- Server Actionsで安全なフォーム処理
- 環境変数でシークレット管理