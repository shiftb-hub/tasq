import type { LearningLog } from "@/app/_types/LearningLog";

// 98% written by AI — I just pressed Enter. (>_<)

// 開発中のモック生成に一時的に使用する型
type LearningLogDevType = LearningLog & {
  createdAt: Date;
};

/**
 * startedAt:
 *  - DB型: DateTime? / TS型: Date | undefined
 *  - UI/UX上は任意入力項目
 *  - 欠損値を許容するため、ダミーデータでは undefined（またはコメントアウト）で設定
 *  - endedAt も同様の扱い
 *
 * spentMinutes:
 *  - DB型: Int / TS型: number
 *  - UI/UX上は任意入力項目（0 を「未設定」として扱う）
 *  - 必ずしも endedAt - startedAt = spentMinutes とは限らない
 *   - 学習期間と、実学習時間は異なるケースもあるため
 */

export const learningLogsMock: LearningLogDevType[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440101",
    title: "#01 Hello Worldと戦って敗北",
    description: `• コンソールに「Hello World」を表示させようとした
• console.log()をconsole.log("Hello World")と書いたら動いた
• なぜかブラウザのコンソールを30分間眺めていた
• 「なんで画面に出ないの？」と1時間悩んだ末、HTMLに書くものだと気づく`,
    reflections: `• JavaScriptとHTMLの違いがよくわからない
• console.logは画面ではなくコンソールに出ることを学習
• プログラミングは魔法ではないことを実感
• 明日はalertを試してみたい`,
    spentMinutes: 120,
    startedAt: new Date("2024-01-15T09:00:00Z"),
    endedAt: new Date("2024-01-15T11:00:00Z"),
    createdAt: new Date("2024-01-15T11:05:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440102",
    title: "#02 npm installとの初対面で撃沈",
    description: `• 「npm install」を実行したら大量の文字が流れて恐怖
• node_modulesフォルダが突然現れて「ウイルス？」と思った
• package.jsonを見て「これ何語？」状態
• yarn vs npm論争を知らずにyarnも試して混乱`,
    reflections: `• パッケージマネージャーという概念を初めて知った
• node_modulesは触ってはいけない聖域だと理解
• package.jsonは設定ファイルだと学習（まだよくわからない）
• 次回はnpmだけに絞って学習する`,
    spentMinutes: 90,
    startedAt: new Date("2024-01-16T14:00:00Z"),
    endedAt: new Date("2024-01-16T15:30:00Z"),
    createdAt: new Date("2024-01-16T15:35:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440103",
    title: "#03 JSXの不思議な世界に迷い込む",
    description: `• HTMLの中にJavaScriptが書けることに感動
• {name}で変数が表示されることに「魔法だ！」と興奮
• classをclassNameに変えるルールで1時間ハマる
• 「なんでforがhtmlForなの？」と深夜まで調べた`,
    reflections: `• JSXはJavaScript XMLの略だと知った
• ReactはHTMLとJavaScriptを混ぜる革命的な技術だと理解
• 予約語の衝突問題について学習
• まだ{}の中で何ができるかよくわからない`,
    spentMinutes: 180,
    startedAt: new Date("2024-01-17T19:00:00Z"),
    endedAt: new Date("2024-01-17T22:00:00Z"),
    createdAt: new Date("2024-01-17T22:10:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440104",
    title: "#04 useStateで状態管理の沼にはまる",
    description: `• const [count, setCount] = useState(0)をコピペして動いて驚愕
• 分割代入という文法を初めて知って混乱
• setCountを直接countに代入しようとしてエラー祭り
• 「なんで変数を変数で変更するの？」と哲学的になった`,
    reflections: `• 状態管理という概念の入り口に立った
• 分割代入は便利だが慣れるまで時間がかかりそう
• Reactは普通のJavaScriptとは違うルールがあることを実感
• 明日はuseEffectに挑戦してみたい（と思ったが怖い）`,
    spentMinutes: 150,
    startedAt: new Date("2024-01-18T10:30:00Z"),
    endedAt: new Date("2024-01-18T13:00:00Z"),
    createdAt: new Date("2024-01-18T13:15:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440105",
    title: "#05 TypeScriptの型エラーに怯える日々",
    description: `• 赤い波線が画面中に現れて「バグった？」と思った
• stringとnumberの違いで30分固まる
• any型を発見して「これで全部解決！」と思ったら怒られた
• interfaceとtypeの違いを調べて頭がパンク`,
    reflections: `• TypeScriptは厳しい先生のような存在だと理解
• 型安全性という概念を知ったが実感はまだない
• any型は禁じ手だということを学習
• 型定義ファイルの存在を知って震えた`,
    spentMinutes: 200,
    startedAt: new Date("2024-01-19T13:00:00Z"),
    endedAt: new Date("2024-01-19T16:20:00Z"),
    createdAt: new Date("2024-01-19T16:30:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440106",
    title: "#06Next.js App Routerの迷子事件",
    description: `• pages/とapp/の違いで半日溶けた
• ファイルベースルーティングに「未来だ！」と感動
• layout.tsxの概念が理解できず涙目
• 'use client'の意味を調べて宇宙を感じた`,
    reflections: `• App Routerは新しい機能だから情報が少ないことを知った
• サーバーサイドとクライアントサイドの境界線があることを学習
• ファイル名がURLになるのは便利だが責任重大
• まだ全体像が見えないが少しずつ理解していきたい`,
    spentMinutes: 240,
    startedAt: new Date("2024-01-20T09:00:00Z"),
    endedAt: new Date("2024-01-20T13:00:00Z"),
    createdAt: new Date("2024-01-20T13:20:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440107",
    title: "#07 コンポーネント設計で哲学者になった日",
    description: `• 「どこまでが1つのコンポーネント？」で3時間悩んだ
• props drilling という恐ろしい現象を知った
• ButtonコンポーネントにonClickを渡す感動体験
• 再利用可能性について考えすぎて動けなくなった`,
    reflections: `• コンポーネントは小さく分けるのが良いらしいと学習
• propsは親から子への一方通行だと理解
• 設計は正解がないから怖いが楽しい
• もっとたくさんコンポーネントを作って慣れたい`,
    spentMinutes: 210,
    startedAt: new Date("2024-01-21T14:00:00Z"),
    endedAt: new Date("2024-01-21T17:30:00Z"),
    createdAt: new Date("2024-01-21T17:45:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440108",
    title: "#08 CSS-in-JSの奇妙な体験",
    description: `• styled-componentsを見て「CSSがJSの中に？」と混乱
• バッククォートの中にCSSを書く不思議体験
• Tailwind CSSのクラス名の嵐に圧倒される
• 結局インラインスタイルに逃げて自己嫌悪`,
    reflections: `• CSS-in-JSという発想があることを知って驚いた
• Tailwindは便利そうだがクラス名を覚えるのが大変
• スタイリング手法が多すぎて選択麻痺状態
• まずは基本のCSSをしっかり覚えるべきかも`,
    spentMinutes: 160,
    startedAt: new Date("2024-01-22T10:00:00Z"),
    endedAt: new Date("2024-01-22T12:40:00Z"),
    createdAt: new Date("2024-01-22T12:50:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440109",
    title: "#09 APIルートで初めてのバックエンド体験",
    description: `• api/hello/route.tsを作って「俺もバックエンドエンジニア！」と興奮
• GETとPOSTの違いを体で覚える
• fetchでAPIを叩いてJSONが返ってきた時の感動
• CORSエラーで「何語？」状態になった`,
    reflections: `• フロントエンドとバックエンドの境界が曖昧になってきた
• REST APIという概念を初めて実感
• Next.jsはフルスタックフレームワークだと理解
• エラーハンドリングの重要性を痛感`,
    spentMinutes: 190,
    startedAt: new Date("2024-01-23T15:00:00Z"),
    endedAt: new Date("2024-01-23T18:10:00Z"),
    createdAt: new Date("2024-01-23T18:25:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440110",
    title: "#10 デプロイで現実を知る",
    description: `• Vercelにデプロイしたら「え、こんな簡単？」と驚愕
• 環境変数という概念で頭がパニック
• 本番環境とローカル環境の違いで初めて挫折を味わう
• 「なんでローカルでは動いたのに？」が口癖になった`,
    reflections: `• デプロイは魔法ではなく技術だと理解
• 環境設定の重要性を身をもって学習
• 本番環境特有の問題があることを知った
• Next.jsとVercelの相性の良さに感動`,
    spentMinutes: 300,
    startedAt: new Date("2024-01-24T08:00:00Z"),
    endedAt: new Date("2024-01-24T13:00:00Z"),
    createdAt: new Date("2024-01-24T13:15:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440111",
    title: "#11 useEffectの副作用に副作用を起こす",
    description: `• useEffectを使ったら無限ループが発生して画面が固まった
• 依存配列の概念で「配列って何入れるの？」状態
• cleanupしないとメモリリークすると知って震えた
• useCallbackとuseMemoの違いで2時間溶けた`,
    reflections: `• 副作用という概念がようやく腑に落ちた
• 依存配列は生命線だということを学習
• パフォーマンスを意識する必要があることを知った
• Reactフックは奥が深すぎて怖い`,
    spentMinutes: 220,
    startedAt: new Date("2024-01-25T14:30:00Z"),
    endedAt: new Date("2024-01-25T18:10:00Z"),
    createdAt: new Date("2024-01-25T18:20:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440112",
    title: "#12 Gitで初めての時空間移動",
    description: `• git addとgit commitの違いがわからず30分固まる
• 「なんでステージングエリアがあるの？」と疑問に思った
• git pushでコードが空の彼方に飛んでいく感動
• 間違えてmasterに直pushして先輩に怒られた`,
    reflections: `• バージョン管理の重要性を身をもって学習
• gitは時間を操る魔法のツールだと理解
• ブランチ戦略というものがあることを知った
• コミットメッセージの書き方にもルールがあることを学習`,
    spentMinutes: 180,
    startedAt: new Date("2024-01-26T09:00:00Z"),
    endedAt: new Date("2024-01-26T12:00:00Z"),
    createdAt: new Date("2024-01-26T12:15:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440013",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440113",
    title: "#13 ESLintに人格を否定される",
    description: `• 赤い波線だらけのコードを見て絶望
• 「unused variable」で30個のエラーが出て泣きそうになった
• prettierと喧嘩して設定ファイル地獄に迷い込む
• 「なんで勝手に改行されるの？」と1時間格闘`,
    reflections: `• コード品質を保つ仕組みがあることを知った
• linterとformatterの違いを学習
• 一貫性のあるコードスタイルの重要性を実感
• ルールに従うことで読みやすいコードが書けることを理解`,
    spentMinutes: 140,
    startedAt: new Date("2024-01-27T13:00:00Z"),
    endedAt: new Date("2024-01-27T15:20:00Z"),
    createdAt: new Date("2024-01-27T15:30:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440014",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440114",
    title: "#14 データベースとの初デート",
    description: `• SQLiteを使って「データベースって軽いんだ」と感動
• SELECT文で「これ英語みたい」と思った
• JOINで複数テーブルを繋げた時の「魔法だ！」体験
• ORMという概念を知って「もうSQL書かなくていいの？」と興奮`,
    reflections: `• データの永続化という概念を理解
• リレーショナルデータベースの設計思想を学習
• ORMは便利だがSQLの基礎も大事だと理解
• データベース設計の奥深さを感じた`,
    spentMinutes: 250,
    startedAt: new Date("2024-01-28T10:00:00Z"),
    endedAt: new Date("2024-01-28T14:10:00Z"),
    createdAt: new Date("2024-01-28T14:20:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440015",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440115",
    title: "#15 認証機能で守られた世界",
    description: `• JWT（ジェイダブリューティー）の読み方で迷った
• ハッシュ化とは何かを理解するのに1時間かかった
• セッションとトークンの違いで頭がパンク
• 「パスワードをそのまま保存しちゃダメ」で震えた`,
    reflections: `• セキュリティの重要性を痛感
• 暗号化という技術の偉大さを学習
• 認証と認可の違いを理解
• セキュリティホールの怖さを知った`,
    spentMinutes: 270,
    startedAt: new Date("2024-01-29T11:00:00Z"),
    endedAt: new Date("2024-01-29T15:30:00Z"),
    createdAt: new Date("2024-01-29T15:45:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440016",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440116",
    title: "#16 レスポンシブデザインで画面サイズと戦争",
    description: `• 「スマホでも見れるサイトを」と言われて途方に暮れた
• media queryという救世主を発見
• flexboxで要素が思わぬ方向に飛んでいく現象に遭遇
• 「なんでスマホだと崩れるの？」で半日溶けた`,
    reflections: `• モバイルファーストの考え方を学習
• CSSグリッドとflexboxの使い分けを理解
• デバイスの多様性を実感
• デザインはコードだけでなくユーザー体験も重要だと気づいた`,
    spentMinutes: 320,
    startedAt: new Date("2024-01-30T09:00:00Z"),
    endedAt: new Date("2024-01-30T14:20:00Z"),
    createdAt: new Date("2024-01-30T14:35:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440017",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440117",
    title: "#17 パフォーマンス最適化の底なし沼",
    description: `• 「サイトが重い」と言われてパニック
• Lighthouseスコアで20点を叩き出して絶望
• 画像最適化という概念を初めて知った
• バンドルサイズ？チャンクって何？状態になった`,
    reflections: `• パフォーマンスも機能の一部だと理解
• 最適化は終わりのない戦いだと学習
• ユーザー体験の重要性を実感
• 測定しなければ改善できないことを知った`,
    spentMinutes: 280,
    startedAt: new Date("2024-01-31T13:00:00Z"),
    endedAt: new Date("2024-01-31T17:40:00Z"),
    createdAt: new Date("2024-01-31T17:55:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440018",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440118",
    title: "#18 テストコードという未知の領域",
    description: `• 「テストも書いてね」と言われて「え？」となった
• Jestという名前に「冗談？」と思った
• expectとtoBeの関係性で混乱
• 「何をテストすればいいの？」で哲学的になった`,
    reflections: `• テストは保険のようなものだと理解
• TDD（Test Driven Development）という考え方を知った
• 品質を保つ仕組みの重要性を学習
• テストが書けることも技術力の一部だと実感`,
    spentMinutes: 200,
    startedAt: new Date("2024-02-01T10:30:00Z"),
    endedAt: new Date("2024-02-01T13:50:00Z"),
    createdAt: new Date("2024-02-01T14:05:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440019",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440119",
    title: "#19 状態管理ライブラリの激戦区",
    description: `• Redux、Zustand、Jotai...「どれ選べばいいの？」状態
• useContextだけじゃダメなの？と疑問に思った
• 状態の正規化って何？で頭がパンク
• グローバル状態とローカル状態の境界線で悩んだ`,
    reflections: `• 状態管理の複雑さを実感
• 適材適所でライブラリを選ぶ重要性を学習
• シンプルから始めて複雑にしていく戦略を理解
• 状態設計もアーキテクチャの一部だと気づいた`,
    spentMinutes: 240,
    startedAt: new Date("2024-02-02T14:00:00Z"),
    endedAt: new Date("2024-02-02T18:00:00Z"),
    createdAt: new Date("2024-02-02T18:15:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440020",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440120",
    title: "#20 Docker化で環境構築革命",
    description: `• 「環境構築で1日潰れる」という先輩の言葉の意味を理解
• Dockerfileを見て「これレシピみたい」と思った
• 「動く環境をそのまま持ち運べる」衝撃体験
• docker-composeで複数サービスが立ち上がる魔法`,
    reflections: `• コンテナ化技術の革新性を実感
• 開発環境の統一化の重要性を学習
• インフラストラクチャーも code として管理できることを知った
• 本番環境との差異を減らす重要性を理解`,
    spentMinutes: 300,
    startedAt: new Date("2024-02-03T09:00:00Z"),
    endedAt: new Date("2024-02-03T14:00:00Z"),
    createdAt: new Date("2024-02-03T14:20:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440021",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440121",
    title: "#21 GraphQLでRESTに別れを告げる",
    description: `• 「必要なデータだけ取得」という概念に感動
• Queryという言葉でSQLを思い出して混乱
• オーバーフェッチングという問題があったことを初めて知った
• Apollo Clientで「もうfetchは使わないの？」状態`,
    reflections: `• データ取得の効率化について学習
• スキーマファーストの開発手法を理解
• 型安全性がフロントエンドまで届くことの価値を実感
• RESTとGraphQLの使い分けを考えるようになった`,
    spentMinutes: 260,
    startedAt: new Date("2024-02-04T11:00:00Z"),
    endedAt: new Date("2024-02-04T15:20:00Z"),
    createdAt: new Date("2024-02-04T15:35:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440022",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440122",
    title: "#22 マイクロフロントエンドで世界観が変わる",
    description: `• 「フロントエンドも分割できるの？」という衝撃
• Module Federationという魔法の技術
• チーム間でのコンポーネント共有という発想
• 「モノリスからマイクロへ」の流れを実感`,
    reflections: `• アーキテクチャ設計の奥深さを学習
• 組織構造とシステム構造の関係性を理解
• 大規模開発での課題と解決策を知った
• 技術選択が組織運営に与える影響を実感`,
    spentMinutes: 290,
    startedAt: new Date("2024-02-05T13:30:00Z"),
    endedAt: new Date("2024-02-05T18:20:00Z"),
    createdAt: new Date("2024-02-05T18:40:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440023",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440123",
    title: "#23 PWAでネイティブアプリに挑戦状",
    description: `• Service Workerという概念で「ブラウザでもオフライン？」と驚愕
• manifest.jsonで「アプリっぽくなった！」と興奮
• キャッシュ戦略で「どのデータをいつキャッシュ？」と悩んだ
• プッシュ通知でWeb技術の進歩を実感`,
    reflections: `• Webアプリとネイティブアプリの境界が曖昧になってきた
• オフラインファーストという考え方を学習
• ユーザー体験の向上技術の多様性を知った
• PWAはWeb技術の集大成だと理解`,
    spentMinutes: 210,
    startedAt: new Date("2024-02-06T10:00:00Z"),
    endedAt: new Date("2024-02-06T13:30:00Z"),
    createdAt: new Date("2024-02-06T13:45:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440024",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440124",
    title: "#24 WebAssemblyで速度の限界に挑む",
    description: `• 「JavaScriptより速い？」という驚愕の事実
• Rustでコンパイルして.wasmファイルが生成される不思議体験
• ブラウザでC++が動く世界観に震えた
• 計算集約的処理の革命を目の当たりにした`,
    reflections: `• Webの可能性が無限大だと実感
• パフォーマンス最適化の新しい次元を学習
• 異なる言語をWebで活用する技術に感動
• 未来のWeb開発の方向性を垣間見た`,
    spentMinutes: 180,
    startedAt: new Date("2024-02-07T14:00:00Z"),
    endedAt: new Date("2024-02-07T17:00:00Z"),
    createdAt: new Date("2024-02-07T17:15:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440025",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440125",
    title: "#25 CI/CDパイプラインで自動化の世界",
    description: `• GitHub Actionsで「コードをpushしたら勝手にデプロイ？」と感動
• 「テストが通らないとマージできない」仕組みに安心感
• YAML地獄で「インデントが命運を分ける」恐怖体験
• 自動化の力で人的ミスが減ることを実感`,
    reflections: `• 継続的インテグレーションの重要性を学習
• 品質保証の自動化という概念を理解
• DevOpsという考え方の一端を知った
• 手作業の削減がいかに重要かを実感`,
    spentMinutes: 230,
    startedAt: new Date("2024-02-08T09:30:00Z"),
    endedAt: new Date("2024-02-08T13:20:00Z"),
    createdAt: new Date("2024-02-08T13:35:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440026",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440126",
    title: "#26 Web3の分散世界に足を踏み入れる",
    description: `• MetaMaskという財布をブラウザに入れる不思議体験
• スマートコントラクトで「コードが契約？」と混乱
• ガス代という概念で「計算にお金がかかる」衝撃
• 分散アプリケーション（DApp）の可能性に震えた`,
    reflections: `• ブロックチェーン技術とWeb開発の融合を学習
• 中央集権的でないシステムの革新性を理解
• 新しい価値創造の仕組みを知った
• 技術の進歩のスピードに圧倒された`,
    spentMinutes: 270,
    // startedAt: new Date("2024-02-09T11:00:00Z"),
    // endedAt: new Date("2024-02-09T15:30:00Z"),
    createdAt: new Date("2024-02-09T15:45:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440027",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440127",
    title: "#27 AI/MLライブラリで未来を体感",
    description: `• TensorFlow.jsでブラウザでもAI？という驚愕
• 画像認識がリアルタイムで動く魔法体験
• 機械学習モデルをWebアプリに組み込む感動
• 「俺もAIエンジニア！」と勘違いした1日`,
    reflections: `• AIとWeb技術の融合の可能性を実感
• エッジコンピューティングという概念を学習
• ユーザー体験の新しい次元を発見
• 技術の民主化を身をもって体験`,
    spentMinutes: 0,
    startedAt: new Date("2024-02-10T13:00:00Z"),
    endedAt: new Date("2024-02-10T17:10:00Z"),
    createdAt: new Date("2024-02-10T17:25:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440028",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440128",
    title: "#28 アクセシビリティで全ての人に優しく",
    description: `• スクリーンリーダーという技術の存在を初めて知った
• ARIA属性で「何これ？」状態になった
• キーボードナビゲーションで「マウス使えない人もいる」と気づいた
• 色のコントラスト比という概念で設計の奥深さを実感`,
    reflections: `• Webは全ての人のためのものだと理解
• インクルーシブデザインという考え方を学習
• 技術的配慮が社会貢献につながることを実感
• ユーザビリティの本当の意味を知った`,
    spentMinutes: 190,
    // startedAt: new Date("2024-02-11T10:00:00Z"),
    // endedAt: new Date("2024-02-11T13:10:00Z"),
    createdAt: new Date("2024-02-11T13:25:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440029",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440129",
    title: "#29 マイクロサービス設計で複雑さと向き合う",
    description: `• 「1つのアプリを小さく分割？」という発想転換
• サービス間通信で「HTTP通信が内部でも？」と驚いた
• 分散システムの複雑さに「シンプルが一番」と悟った
• 障害の分離という考え方で安全性の重要性を学習`,
    reflections: `• アーキテクチャ設計の責任の重さを実感
• トレードオフという概念の重要性を理解
• システム設計は芸術と科学の融合だと気づいた
• 組織の成長とシステム構造の関係性を学習`,
    spentMinutes: 310,
    startedAt: new Date("2024-02-12T09:00:00Z"),
    endedAt: new Date("2024-02-12T14:10:00Z"),
    createdAt: new Date("2024-02-12T14:30:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440030",
    userId: "550e8400-e29b-41d4-a716-446655440099",
    taskId: "550e8400-e29b-41d4-a716-446655440130",
    title: "#30 プログラマーとしての成長を振り返る",
    description: `• 1ヶ月前の自分のコードを見て「誰が書いたの？」と思った
• Hello Worldから始まって今ではAPIも作れるようになった
• エラーメッセージが友達になった（最初は敵だったのに）
• 「なんで動かないの？」から「なぜ動くのか？」に思考が変化した`,
    reflections: `• 学習は永続的なプロセスだと理解
• 基礎の重要性を改めて実感
• コミュニティの力とメンターの大切さを知った
• 技術的成長と人間的成長は並行することを学習
• 明日からも新しい技術に挑戦し続けたい`,
    spentMinutes: 120,
    startedAt: new Date("2024-02-13T16:00:00Z"),
    endedAt: new Date("2024-02-13T18:00:00Z"),
    createdAt: new Date("2024-02-13T18:15:00Z"),
  },
];
