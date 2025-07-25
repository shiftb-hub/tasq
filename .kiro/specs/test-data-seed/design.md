# 設計書

## 概要

TASQプラットフォーム用の包括的なテストデータ生成システムを設計する。このシステムは、現実的で一貫性のあるテストデータを自動生成し、開発・テスト環境での機能検証を支援する。

## アーキテクチャ

### システム構成

```
seed.ts
├── データクリア処理
├── マスターデータ生成
├── ユーザーデータ生成
├── タスクデータ生成
├── 関係データ生成
└── ログデータ生成
```

### データ生成フロー

1. **初期化**: 既存データの安全な削除
2. **マスターデータ**: Status、Tag、ActivityTypeの生成
3. **ユーザー**: 各ロールのユーザー生成とSupabase認証
4. **タスク**: 学生ユーザーに紐づくタスク生成
5. **関係**: 講師-生徒、講師-タスクの関係生成
6. **ログ**: 学習ログと対応ログの生成

## コンポーネントと インターフェース

### データ生成ユーティリティ

```typescript
type DataGenerator {
  // 日本語名前生成
  generateJapaneseName(): string;

  // SNSアカウント生成
  generateSocialAccounts(): SocialAccounts;

  // 現実的なタスクタイトル生成
  generateTaskTitle(chapter?: number): string;

  // 学習時間生成（15分-4時間）
  generateStudyTime(): number;

  // 日本語の学習要約生成
  generateStudySummary(): string;
}
```

### マスターデータ定義

```typescript
type MasterData {
  statuses: StatusData[];
  tags: TagData[];
  activityTypes: ActivityTypeData[];
}

type StatusData {
  name: string;
  order: number;
  icon?: string;
}
```

### テストユーザー設定

```typescript
type TestUserConfig {
  role: Role;
  count: number;
  namePrefix?: string;
  emailDomain: string;
}
```

## データモデル

### 生成データの構造

#### ユーザーデータ

- **学生**: 12名（チャプター1-10を学習中）
- **TA**: 3名（レビュー担当）
- **講師**: 4名（指導・ブックマーク機能）
- **管理者**: 2名（システム管理）

#### マスターデータ

- **ステータス**: 「作業中」「レビュー待ち」「完了」「保留」「キャンセル」
- **感情タグ**: 「不安」「確認したい」「迷っている」「困っている」「楽しい」
- **アクティビティ**: 「じっくり考える」「試す」「調べる」「復習する」「質問する」

#### タスクデータ

- 各学生に5-15個のタスク
- チャプター1-10に関連
- 現実的な開始・終了日時
- 複数のタグとアクティビティタイプ

#### 関係データ

- 講師-生徒ブックマーク: 各講師が2-5名の学生をブックマーク
- 講師-タスクブックマーク: 各講師が5-15個のタスクをブックマーク
- 対応ログ: ブックマークされたタスクの30%に対応記録

## エラーハンドリング

### データ整合性チェック

- 外部キー制約違反の防止
- 重複データの回避
- 必須フィールドの検証

### エラー処理戦略

```typescript
try {
  await generateTestData();
} catch (error) {
  console.error("シードデータ生成エラー:", error);
  await rollbackChanges();
  process.exit(1);
}
```

### ロールバック機能

- 部分的な生成失敗時の安全な復旧
- トランザクション管理
- エラー詳細のログ出力

## テスト戦略

### データ検証

1. **生成数の確認**: 指定された数のレコードが生成されているか
2. **関係整合性**: 外部キー参照が正しく設定されているか
3. **データ品質**: 現実的で意味のあるデータが生成されているか
4. **日本語対応**: 文字化けや不適切な文字列がないか

### テストケース

```typescript
describe("Seed Data Generation", () => {
  it("should generate correct number of users by role");
  it("should create valid task relationships");
  it("should generate realistic Japanese content");
  it("should maintain referential integrity");
});
```

### パフォーマンステスト

- 大量データ生成時の処理時間測定
- メモリ使用量の監視
- データベース接続の効率性

## 実装詳細

### データ生成ライブラリ

- **Faker.js**: 基本的なダミーデータ生成
- **カスタム日本語ジェネレーター**: 現実的な日本語コンテンツ
- **日時ユーティリティ**: 論理的な時系列データ

### Supabase統合

```typescript
// 認証ユーザー作成
const createAuthUser = async (userData: UserData) => {
  const { data, error } = await supabase.auth.admin.createUser({
    id: userData.id,
    email: userData.email,
    password: userData.password,
    email_confirm: true,
  });
};
```

### バッチ処理最適化

- 大量データの効率的な挿入
- トランザクションの適切な分割
- 進行状況の可視化

## セキュリティ考慮事項

### テスト環境限定

- 本番環境での実行防止
- 環境変数による実行制御
- 明確なテストデータ識別

### データ保護

- 個人情報の非使用
- テスト用パスワードの安全な管理
- 機密情報の除外

## 運用・保守

### 実行方法

```bash
# 開発環境でのシード実行
npm run db:seed

# または直接実行
npx prisma db seed
```

### ログ出力

- 処理進行状況の表示
- エラー詳細の記録
- 生成データ統計の出力

### メンテナンス

- 定期的なデータ品質チェック
- 新機能追加時のデータ拡張
- パフォーマンス最適化
