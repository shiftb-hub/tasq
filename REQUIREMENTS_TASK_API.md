# タスク管理API要件定義書

## 1. 概要

本ドキュメントは、TASQシステムにおけるタスク管理機能のAPI実装要件を定義します。
タスク、ステータス、タグ、ActivityTypeの作成・読取・更新・削除（CRUD）操作を提供するRESTful APIを実装します。

## 2. API配置

すべてのAPIエンドポイントは認証が必要な`src/app/(private)/api/`配下に配置します。

## 3. 権限管理

### 3.1 タスク操作権限

| 操作 | STUDENT               | TA                    | TEACHER       | ADMIN         |
| ---- | --------------------- | --------------------- | ------------- | ------------- |
| 作成 | ○（自分のタスクのみ） | ○（自分のタスクのみ） | ○（全タスク） | ○（全タスク） |
| 取得 | ○（自分のタスクのみ） | ○（自分のタスクのみ） | ○（全タスク） | ○（全タスク） |
| 更新 | ○（自分のタスクのみ） | ○（自分のタスクのみ） | ○（全タスク） | ○（全タスク） |
| 削除 | ○（自分のタスクのみ） | ○（自分のタスクのみ） | ○（全タスク） | ○（全タスク） |

### 3.2 マスターデータ操作権限

| 対象         | 作成      | 取得       | 更新      | 削除      |
| ------------ | --------- | ---------- | --------- | --------- |
| ステータス   | ADMINのみ | 全ユーザー | ADMINのみ | ADMINのみ |
| タグ         | ADMINのみ | 全ユーザー | ADMINのみ | ADMINのみ |
| ActivityType | ADMINのみ | 全ユーザー | ADMINのみ | ADMINのみ |

## 4. APIエンドポイント仕様

### 4.1 タスクAPI

#### 4.1.1 タスク一覧取得

- **エンドポイント**: `GET /api/tasks`
- **クエリパラメータ**:
  - `userId?: string` - 特定ユーザーのタスクを取得（TEACHER/ADMINのみ使用可）
  - `statusId?: string` - ステータスでフィルタリング
  - `tagIds?: string | string[]` - 1件以上のタグIDでフィルタリング（例: `?tagIds=a&tagIds=b` または `?tagIds=a,b`）
  - `activityTypeIds?: string | string[]` - 1件以上のActivityType IDでフィルタリング
- **レスポンス**: タスク配列（関連データ含む）

#### 4.1.2 タスク詳細取得

- **エンドポイント**: `GET /api/tasks/[id]`
- **レスポンス**: タスク詳細（関連データ含む）

#### 4.1.3 タスク作成

- **エンドポイント**: `POST /api/tasks`
- **リクエストボディ**:
  ```typescript
  {
    title: string;
    description?: string;
    userId?: string; // TEACHER/ADMINのみ指定可
    statusId: string; // 未指定時はデフォルト「todo」
    tagIds?: string[];
    activityTypeIds?: string[];
    relatedChapter?: number;
    startedAt?: string;
    endedAt?: string;
  }
  ```

#### 4.1.4 タスク更新

- **エンドポイント**: `PUT /api/tasks/[id]`
- **リクエストボディ**: タスク作成と同様（すべてオプショナル）

#### 4.1.5 タスク削除

- **エンドポイント**: `DELETE /api/tasks/[id]`

### 4.2 ステータスAPI

#### 4.2.1 ステータス一覧取得

- **エンドポイント**: `GET /api/statuses`
- **レスポンス**: ステータス配列（orderでソート済み）

#### 4.2.2 ステータス詳細取得

- **エンドポイント**: `GET /api/statuses/[id]`

#### 4.2.3 ステータス作成（ADMINのみ）

- **エンドポイント**: `POST /api/statuses`
- **リクエストボディ**:
  ```typescript
  {
    name: string;
    order: number;
    icon?: string;
  }
  ```

#### 4.2.4 ステータス更新（ADMINのみ）

- **エンドポイント**: `PUT /api/statuses/[id]`

#### 4.2.5 ステータス削除（ADMINのみ）

- **エンドポイント**: `DELETE /api/statuses/[id]`

### 4.3 タグAPI

#### 4.3.1 タグ一覧取得

- **エンドポイント**: `GET /api/tags`
- **レスポンス**: タグ配列（orderでソート済み）

#### 4.3.2 タグ詳細取得

- **エンドポイント**: `GET /api/tags/[id]`

#### 4.3.3 タグ作成（ADMINのみ）

- **エンドポイント**: `POST /api/tags`
- **リクエストボディ**:
  ```typescript
  {
    name: string;
    order: number;
    icon?: string;
  }
  ```

#### 4.3.4 タグ更新（ADMINのみ）

- **エンドポイント**: `PUT /api/tags/[id]`

#### 4.3.5 タグ削除（ADMINのみ）

- **エンドポイント**: `DELETE /api/tags/[id]`

### 4.4 ActivityType API

#### 4.4.1 ActivityType一覧取得

- **エンドポイント**: `GET /api/activity_types`
- **レスポンス**: ActivityType配列（orderでソート済み）

#### 4.4.2 ActivityType詳細取得

- **エンドポイント**: `GET /api/activity_types/[id]`

#### 4.4.3 ActivityType作成（ADMINのみ）

- **エンドポイント**: `POST /api/activity_types`
- **リクエストボディ**:
  ```typescript
  {
    name: string;
    order: number;
    description?: string;
  }
  ```

#### 4.4.4 ActivityType更新（ADMINのみ）

- **エンドポイント**: `PUT /api/activity_types/[id]`

#### 4.4.5 ActivityType削除（ADMINのみ）

- **エンドポイント**: `DELETE /api/activity_types/[id]`

## 5. レスポンス形式

すべてのAPIレスポンスは既存の`ApiResponse`型に準拠します：

```typescript
// 成功時
{
  success: true,
  payload: T
}

// エラー時
{
  success: false,
  payload: null,
  error: {
    appErrorCode: string,
    description: string
  }
}
```

## 6. エラーコード

`AppErrorCodes`に以下のタスク関連エラーコードを追加：

- `TASK_NOT_FOUND`: タスクが見つからない
- `TASK_ACCESS_DENIED`: タスクへのアクセス権限がない
- `TASK_VALIDATION_ERROR`: タスクのバリデーションエラー
- `STATUS_NOT_FOUND`: ステータスが見つからない
- `STATUS_IN_USE`: ステータスが使用中で削除できない
- `TAG_NOT_FOUND`: タグが見つからない
- `TAG_IN_USE`: タグが使用中で削除できない
- `ACTIVITY_TYPE_NOT_FOUND`: ActivityTypeが見つからない
- `ACTIVITY_TYPE_IN_USE`: ActivityTypeが使用中で削除できない
- `ADMIN_REQUIRED`: 管理者権限が必要

## 7. 実装上の考慮事項

### 7.1 トランザクション処理

- タスク作成/更新時のタグ・ActivityType関連付けはトランザクション内で処理

### 7.2 デフォルト値

- タスク作成時、statusIdが未指定の場合は「todo」ステータスを自動設定
- 「todo」ステータスはシードデータで作成し、order=1とする

### 7.3 削除時の整合性

- ステータス、タグ、ActivityType削除時は使用中チェックを実施
- 使用中の場合はエラーを返却

### 7.4 関連データの取得

タスク取得時は以下の関連データを含める：

- user（作成者情報）
- status
- tags（TaskTag経由）
- activityTypes（TaskActivityType経由）

### 7.5 バリデーション

#### タスク

- title: 必須、最大255文字
- description: オプショナル、最大1000文字
- relatedChapter: オプショナル、1以上の整数

#### ステータス/タグ/ActivityType

- name: 必須、最大50文字
- order: 必須、1以上の整数、ユニーク
- icon: オプショナル、最大255文字

## 8. セキュリティ要件

- すべてのAPIは認証必須（middleware.tsで制御）
- SQLインジェクション対策（Prismaで自動対応）
- 権限チェックを各APIで実装
- エラーメッセージに機密情報を含めない

## 9. 実装優先順位

1. **Phase 1**: 基本的なCRUD機能
   - タスクのCRUD
   - ステータスの取得のみ

2. **Phase 2**: マスターデータ管理
   - ステータスのCRUD（ADMINのみ）
   - タグのCRUD
   - ActivityTypeのCRUD

3. **Phase 3**: 高度な機能
   - フィルタリング機能の実装
   - バリデーションの強化

## 10. テスト要件

各APIに対して以下のテストケースを実装：

- 正常系の動作確認
- 権限チェックの確認
- バリデーションエラーの確認
- 存在しないリソースへのアクセス
- 同時実行時の整合性確認
