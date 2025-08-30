# Postman API テストガイド

## 概要

本ドキュメントでは、作成したタスク管理APIをPostmanでテストする方法を説明します。
APIは認証が必要なため、Supabaseのセッションクッキーを使用してアクセスします。

## 認証の仕組み

このプロジェクトはSupabase Authを使用しており、認証情報はクッキーベースで管理されています。
- 認証ミドルウェアがすべての`/api/*`リクエストをチェック
- Supabaseのセッショントークンがクッキーに保存される
- APIアクセス時はこのクッキーを送信する必要がある

## テスト手順

### 1. ブラウザでログイン

まず、開発環境でアプリケーションにログインします：

1. 開発サーバーを起動
   ```bash
   npm run dev
   ```

2. ブラウザで `http://localhost:3000/login` にアクセス

3. テストユーザーの認証情報でログイン
   - メールアドレスとパスワードを入力
   - ログインに成功するとホーム画面にリダイレクトされます

### 2. 認証クッキーの取得

ログイン後、ブラウザの開発者ツールから認証クッキーを取得します：

1. **Chrome/Edge の場合**：
   - F12キーで開発者ツールを開く
   - 「Application」タブを選択
   - 左側メニューの「Storage」→「Cookies」→`http://localhost:3000`を選択
   - 以下のSupabase関連クッキーをコピー：
     - `sb-<project-id>-auth-token`
     - `sb-<project-id>-auth-token.0`
     - `sb-<project-id>-auth-token.1`

2. **Firefox の場合**：
   - F12キーで開発者ツールを開く
   - 「ストレージ」タブを選択
   - 「Cookie」→`http://localhost:3000`を選択
   - 上記と同じSupabase関連クッキーをコピー

### 3. Postmanの設定

#### 方法1: Cookie ヘッダーを手動で設定

1. Postmanで新しいリクエストを作成

2. **Headers**タブで以下を設定：
   ```
   Key: Cookie
   Value: sb-<project-id>-auth-token=<token-value>; sb-<project-id>-auth-token.0=<token-0-value>; sb-<project-id>-auth-token.1=<token-1-value>
   ```

3. **Content-Type**ヘッダーも設定（POSTリクエストの場合）：
   ```
   Key: Content-Type
   Value: application/json
   ```

#### 方法2: Postman Interceptorを使用（推奨）

1. [Postman Interceptor](https://www.postman.com/downloads/)をインストール

2. Postmanで「Cookies」タブを開く

3. 「Sync Cookies」をオンにする

4. ドメイン `localhost:3000` のクッキーが自動的に同期される

## APIエンドポイント一覧とテスト例

### タスクAPI

#### タスク一覧取得
```
GET http://localhost:3000/api/tasks
```

#### タスク作成
```
POST http://localhost:3000/api/tasks
Body (JSON):
{
  "title": "新しいタスク",
  "description": "タスクの説明",
  "tagId": "タグのUUID（オプション）",
  "activityTypeId": "アクティビティタイプのUUID（オプション）"
}
```

#### タスク詳細取得
```
GET http://localhost:3000/api/tasks/{taskId}
```

#### タスク更新
```
PUT http://localhost:3000/api/tasks/{taskId}
Body (JSON):
{
  "title": "更新後のタイトル",
  "description": "更新後の説明"
}
```

#### タスク削除
```
DELETE http://localhost:3000/api/tasks/{taskId}
```

### ステータスAPI

#### ステータス一覧取得
```
GET http://localhost:3000/api/statuses
```

#### ステータス作成（ADMINのみ）
```
POST http://localhost:3000/api/statuses
Body (JSON):
{
  "name": "進行中",
  "order": 2,
  "icon": "🔄"
}
```

### タグAPI

#### タグ一覧取得
```
GET http://localhost:3000/api/tags
```

#### タグ作成（ADMINのみ）
```
POST http://localhost:3000/api/tags
Body (JSON):
{
  "name": "重要",
  "order": 1,
  "icon": "⭐"
}
```

### ActivityType API

#### ActivityType一覧取得
```
GET http://localhost:3000/api/activity_types
```

#### ActivityType作成（ADMINのみ）
```
POST http://localhost:3000/api/activity_types
Body (JSON):
{
  "name": "コーディング",
  "order": 1,
  "description": "プログラミング作業"
}
```

## レスポンス形式

### 成功時
```json
{
  "success": true,
  "data": {
    // リソースのデータ
  }
}
```

### エラー時
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "description": "詳細な説明"
  }
}
```

## エラーコード一覧

- `UNAUTHORIZED`: 認証が必要
- `TASK_NOT_FOUND`: タスクが見つからない
- `TASK_ACCESS_DENIED`: タスクへのアクセス権限がない
- `TASK_VALIDATION_ERROR`: 入力値のバリデーションエラー
- `ADMIN_REQUIRED`: 管理者権限が必要
- `STATUS_IN_USE`: 使用中のステータスは削除できない
- `TAG_IN_USE`: 使用中のタグは削除できない
- `ACTIVITY_TYPE_IN_USE`: 使用中のActivityTypeは削除できない

## トラブルシューティング

### 401 Unauthorized エラーが返される場合

1. **クッキーが正しく設定されているか確認**
   - Cookieヘッダーの値が正しいか
   - クッキーの有効期限が切れていないか

2. **セッションの再取得**
   - ブラウザで再度ログイン
   - 新しいクッキーを取得してPostmanに設定

### 403 Forbidden エラーが返される場合

- **権限の確認**
  - 管理者限定のAPIを一般ユーザーで実行していないか
  - 他のユーザーのタスクにアクセスしようとしていないか

### Supabase接続エラーが発生する場合

1. **Supabaseローカル環境の確認**
   ```bash
   npx supabase status
   ```

2. **必要に応じてSupabaseを再起動**
   ```bash
   npx supabase stop
   npx supabase start
   ```

## 注意事項

- クッキーベースの認証は開発環境でのテスト用です
- 本番環境ではより安全な認証方式（OAuth、JWT Bearer Token等）の使用を検討してください
- セッションクッキーは一定時間で期限切れになるため、定期的に再取得が必要です
- Postman Collectionとして保存しておくと、チーム間でのテスト共有が容易になります