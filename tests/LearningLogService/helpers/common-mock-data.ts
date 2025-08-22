import type { LearningLogInsertRequest } from "@/app/_types/LearningLog";

/**
 * CRUD操作テスト用の共通モックデータ
 * 面白い日本語の学習体験記として作成
 */

/**
 * 単一の学習ログデータ（基本的なCRUD操作テスト用）
 */
export const mockLearningLog: LearningLogInsertRequest = {
  title: "電子珠算機に「おはよう世界」と挨拶を試みるも不発",
  description: `• console.log なるものにて「Hello World」を表示せよとの御下命
• 「コンソール」が何なのかわからず、字引にて調べて「魂を慰める台」と解釈し仏壇を探す
• 結局、F12なる呪文で現れた「文字の世界」に言葉が刻まれることを発見し、活版印刷を超えた技術に感嘆`,
  reflections: `• この電子珠算機は思考を読まず、正確な指令を要することを学習
• 明日は「さようなら世界」も試してみたい`,
  spentMinutes: 180,
  startedAt: new Date("2025-08-11T09:00:00Z"),
  endedAt: new Date("2025-08-11T20:30:00Z"),
};

/**
 * 複数の学習ログデータ（配列での操作テスト用）
 */
export const mockLearningLogs: LearningLogInsertRequest[] = [
  {
    title: "電子珠算機に「おはよう世界」と挨拶を試みるも不発",
    description: `• console.logなるもので「Hello World」を表示せよとの指令
• 「コンソール」が何なのかわからず、「魂を慰める台」と解釈し仏壇を探す
• 結局、F12なる呪文で現れた「文字の世界」に言葉が刻まれることを発見し、活版印刷を超えた技術に感嘆`,
    reflections: `• この電子珠算機は思考を読まず、正確な指令を要することを学習
• 明日は「さようなら世界」も試してみたい`,
    spentMinutes: 180,
    startedAt: new Date("2025-08-11T09:00:00Z"),
    endedAt: new Date("2025-08-11T20:30:00Z"),
  },
  {
    title: "変数なる得体の知れぬものとの格闘",
    description: `• 「変数」は「変わる数」ではないと知り、漢学の勉強が役に立たず愕然
• let、const、varを見て「きっと吉凶があるのだろう」と易占いで使い分けを決めた
• 「=」が「等しい」ではなく「代入」だと知り「寺子屋の先生の墓前で謝罪せねば」と神妙になった`,
    reflections: `• 変数とは値を入れる箱のようなものだと理解（米俵のイメージ）
• varは古い書き方らしく、祟りが怖いので丁寧に扱うことにした`,
    spentMinutes: 480,
    startedAt: new Date("2025-08-12T12:30:00Z"),
    endedAt: new Date("2025-08-12T23:00:00Z"),
  },
  {
    title: "functionなる関数との邂逅で大混乱",
    description: `• 引数(ひきすう)を「ひきかず」と読んで大恥をかく
• 関数を呼び出すのに()が必要と知り「口の形を真似しているのか？」と「あー」の口で呼んでみた`,
    reflections: `returnを忘れるとundefinedになることを痛感（何も返さないのは無礼）
• 関数名は動詞で付けるのが良いらしいが、「御挨拶()」みたいな日本語関数名も作りたい`,
    spentMinutes: 180,
    startedAt: new Date("2025-08-13T18:30:00Z"),
    endedAt: new Date("2025-08-13T21:00:00Z"),
  },
];

/**
 * オプションフィールドが未定義の学習ログデータ（型変換テスト用）
 */
export const mockLearningLogWithOptionalFields: LearningLogInsertRequest = {
  title: "型変換テスト用ログ",
  description: "null値の変換をテストしています",
  reflections: "undefinedとnullの違いを確認中",
  spentMinutes: 120,
  // taskId, startedAt, endedAt は undefined（つまりDBには null で保存される）
};
