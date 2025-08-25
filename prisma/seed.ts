// 実行方法 → npx prisma db seed
import { PrismaClient, Role } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { UserService } from "../src/app/_services/userService";

// 型定義
type User = {
  id: string;
  name: string;
  role: Role;
  slackId?: string | null;
  instagramId?: string | null;
  threadsId?: string | null;
  githubId?: string | null;
  xId?: string | null;
  job?: string | null;
  currentChapter?: number | null;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  userId: string;
  statusId?: string | null;
  relatedChapter?: number | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type Status = {
  id: string;
  name: string;
  order: number;
  icon?: string | null;
};

type Tag = {
  id: string;
  name: string;
  order: number;
  icon?: string | null;
};

type ActivityType = {
  id: string;
  name: string;
  order: number;
  description?: string | null;
};

type LearningLog = {
  id: string;
  userId: string;
  taskId?: string | null;
  title: string;
  description: string;
  reflections: string;
  spentMinutes: number;
  startedAt?: Date | null;
  endedAt?: Date | null;
  createdAt: Date;
};

type AssignmentLog = {
  id: string;
  taskId: string;
  responderId: string;
  description?: string | null;
  createdAt: Date;
};

const prisma = new PrismaClient();

// Supabaseクライアント (ServiceRole) の作成
if (!process.env.SB_SERVICE_ROLE_KEY) {
  console.error("❌ 環境変数 SB_SERVICE_ROLE_KEY が設定されていません");
  console.error("   .envファイルに以下の設定が必要です:");
  console.error("   SB_SERVICE_ROLE_KEY=eyJhb.....");
  console.error("   詳細はREADME.mdを参照してください");
  throw new Error("環境変数 SB_SERVICE_ROLE_KEY が設定されていません");
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321",
  process.env.SB_SERVICE_ROLE_KEY,
);

// 開発用のテストユーザの定義（作業の便宜上、意図的にUUIDは固定値を使用）
// - UUIDv4 第3ブロック先頭 → 4（v4指定）
// - UUIDv4 第4ブロック先頭 → 8（バリアント指定）
// - 本番運用では必ず uuid ライブラリで生成したUUIDを使用すること
const testUsers = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    email: "user1@example.com",
    password: "##user1",
    name: "構文 誤次郎",
    role: Role.STUDENT,
    slackId: "@user1",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    email: "user2@example.com",
    password: "##user2",
    name: "仕様 曖昧子",
    role: Role.STUDENT,
    slackId: "@user2",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    email: "user3@example.com",
    password: "##user3",
    name: "保守 絶望太",
    role: Role.STUDENT,
    slackId: "@user3",
  },
  // 追加のテストユーザー（7名）
  {
    id: "44444444-4444-4444-8444-444444444444",
    email: "user4@example.com",
    password: "##user4",
    name: "実装 速太郎",
    role: Role.STUDENT,
    slackId: "@user4",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    email: "user5@example.com",
    password: "##user5",
    name: "設計 美代子",
    role: Role.TA,
    slackId: "@user5",
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    email: "user6@example.com",
    password: "##user6",
    name: "品質 守",
    role: Role.TA,
    slackId: "@user6",
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    email: "user7@example.com",
    password: "##user7",
    name: "開発 統括太",
    role: Role.TEACHER,
    slackId: "@user7",
  },
  {
    id: "88888888-8888-4888-8888-888888888888",
    email: "user8@example.com",
    password: "##user8",
    name: "技術 伝道師",
    role: Role.TEACHER,
    slackId: "@user8",
  },
  {
    id: "99999999-9999-4999-8999-999999999999",
    email: "user9@example.com",
    password: "##user9",
    name: "運用 監視子",
    role: Role.ADMIN,
    slackId: "@user9",
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    email: "user10@example.com",
    password: "##user10",
    name: "学習 熱心男",
    role: Role.STUDENT,
    slackId: "@user10",
  },
];

// データクリア処理（外部キー制約を考慮した順序）
const clearData = async () => {
  console.log("🗑️ 既存データをクリアしています...");

  try {
    // 依存関係の順序でデータを削除（外部キー制約を考慮）
    console.log("📝 AssignmentLogを削除中...");
    await prisma.assignmentLog.deleteMany();

    console.log("📝 LearningLogを削除中...");
    await prisma.learningLog.deleteMany();

    console.log("📝 TeacherTaskを削除中...");
    await prisma.teacherTask.deleteMany();

    console.log("📝 TeacherStudentを削除中...");
    await prisma.teacherStudent.deleteMany();

    console.log("📝 TaskActivityTypeを削除中...");
    await prisma.taskActivityType.deleteMany();

    console.log("📝 TaskTagを削除中...");
    await prisma.taskTag.deleteMany();

    console.log("📝 Taskを削除中...");
    await prisma.task.deleteMany();

    console.log("📝 ActivityTypeを削除中...");
    await prisma.activityType.deleteMany();

    console.log("📝 Tagを削除中...");
    await prisma.tag.deleteMany();

    console.log("📝 Statusを削除中...");
    await prisma.status.deleteMany();

    console.log("📝 Userを削除中...");
    await prisma.user.deleteMany();

    console.log("✅ データクリアが完了しました");
  } catch (error) {
    console.error("❌ データクリア中にエラーが発生しました:", error);
    throw error;
  }
};

// 日本語データ生成のためのユーティリティ
const japaneseData = {
  // 名前の生成用データ
  lastNames: [
    "佐藤",
    "鈴木",
    "高橋",
    "田中",
    "伊藤",
    "渡辺",
    "山本",
    "中村",
    "小林",
    "加藤",
  ],
  firstNamesMale: [
    "太郎",
    "次郎",
    "健",
    "大輔",
    "翔",
    "拓海",
    "悠斗",
    "陽斗",
    "大和",
    "蓮",
  ],
  firstNamesFemale: [
    "花子",
    "美咲",
    "愛",
    "さくら",
    "葵",
    "結衣",
    "陽菜",
    "凛",
    "莉子",
    "美月",
  ],

  // タスクタイトルのテンプレート
  taskTitles: [
    "React Hooksの理解を深める",
    "TypeScriptの型定義について学ぶ",
    "Next.jsのApp Routerを使ってみる",
    "Prismaでデータベース操作を実装",
    "TailwindCSSでレスポンシブデザイン",
    "認証機能の実装",
    "APIエンドポイントの設計",
    "状態管理の最適化",
    "パフォーマンスチューニング",
    "テストコードの作成",
  ],

  // 学習ログのタイトルテンプレート
  learningTitles: [
    "Reactコンポーネントの実装",
    "エラーハンドリング実装",
    "非同期処理の学習",
    "デザインパターンの理解",
    "デバッグスキル向上",
    "パフォーマンス最適化",
    "テスト実装の学習",
    "UI/UXの改善",
  ],

  // 学習内容の詳細テンプレート
  learningDescriptions: [
    "コンポーネントの実装方法について理解が深まった。Hooksを使った状態管理やライフサイクルの制御方法を学習した。",
    "エラーハンドリングの重要性を学んだ。try-catchの使い方やカスタムエラークラスの作成方法を習得した。",
    "非同期処理の扱い方が分かってきた。async/awaitやPromiseの概念をしっかり理解できた。",
    "デザインパターンについて新しい知識を得た。特にObserverパターンとFactoryパターンの実装を学習した。",
    "デバッグ手法を身につけることができた。Chrome DevToolsの効果的な使い方を習得した。",
  ],

  // 振り返り・課題のテンプレート
  learningReflections: [
    "型エラーの解決に時間がかかったが、TypeScriptの型システムへの理解が深まった。次回は型定義をより慎重に行いたい。",
    "想定通りの動作にならず原因を探るのが大変だったが、デバッグスキルが向上した。ログ出力を効果的に使えるようになった。",
    "ドキュメントの内容が理解しづらかったが、実際にコードを書いて試すことで理解できた。手を動かすことの重要性を再認識した。",
    "実装方針で迷いが生じたが、先輩エンジニアのアドバイスで解決できた。設計段階での検討が重要だと学んだ。",
    "パフォーマンスの改善方法が分からなかったが、プロファイリングツールの使い方を学べた。計測の重要性を理解した。",
  ],
};

// ランダム要素選択のユーティリティ関数
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// ランダム数値生成のユーティリティ関数
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 日本語名前生成関数
const generateJapaneseName = (gender: "male" | "female" = "male"): string => {
  const lastName = getRandomElement(japaneseData.lastNames);
  const firstName =
    gender === "male"
      ? getRandomElement(japaneseData.firstNamesMale)
      : getRandomElement(japaneseData.firstNamesFemale);
  return `${lastName} ${firstName}`;
};

// 進行状況表示関数
const logProgress = (step: string, current?: number, total?: number) => {
  if (current && total) {
    console.log(`📊 ${step}: ${current}/${total}`);
  } else {
    console.log(`🔄 ${step}`);
  }
};

// マスターデータ生成関数
const createMasterData = async () => {
  // ステータスマスタの生成
  const statusData = [
    { name: "作業中", order: 1, icon: "⚡" },
    { name: "レビュー待ち", order: 2, icon: "👀" },
    { name: "修正中", order: 3, icon: "🔧" },
    { name: "完了", order: 4, icon: "✅" },
    { name: "保留", order: 5, icon: "⏸️" },
  ];

  const statuses = await Promise.all(
    statusData.map((status) => prisma.status.create({ data: status })),
  );

  logProgress(
    "ステータスマスタを生成しました",
    statuses.length,
    statusData.length,
  );

  // タグ（感情タグ）マスタの生成
  const tagData = [
    { name: "不安", order: 1, icon: "😟" },
    { name: "確認したい", order: 2, icon: "🤔" },
    { name: "迷っている", order: 3, icon: "😕" },
    { name: "楽しい", order: 4, icon: "😊" },
    { name: "難しい", order: 5, icon: "😣" },
    { name: "理解できた", order: 6, icon: "💡" },
    { name: "もっと知りたい", order: 7, icon: "🔍" },
    { name: "自信がない", order: 8, icon: "😰" },
  ];

  const tags = await Promise.all(
    tagData.map((tag) => prisma.tag.create({ data: tag })),
  );

  logProgress("タグマスタを生成しました", tags.length, tagData.length);

  // アクティビティタイプマスタの生成
  const activityTypeData = [
    {
      name: "じっくり考える",
      order: 1,
      description: "深く思考し、問題の本質を理解する",
    },
    {
      name: "試す",
      order: 2,
      description: "実際にコードを書いて動作を確認する",
    },
    {
      name: "調べる",
      order: 3,
      description: "ドキュメントや資料を読んで情報収集する",
    },
    { name: "質問する", order: 4, description: "他の人に質問して理解を深める" },
    { name: "振り返る", order: 5, description: "学習内容を整理して定着させる" },
    { name: "実装する", order: 6, description: "実際の機能を作成する" },
    { name: "デバッグする", order: 7, description: "エラーや不具合を修正する" },
    { name: "設計する", order: 8, description: "実装前に構造や仕様を考える" },
  ];

  const activityTypes = await Promise.all(
    activityTypeData.map((activityType) =>
      prisma.activityType.create({ data: activityType }),
    ),
  );

  logProgress(
    "アクティビティタイプマスタを生成しました",
    activityTypes.length,
    activityTypeData.length,
  );

  return { statuses, tags, activityTypes };
};


// タスクデータ生成関数
const createTasks = async (users: User[], statuses: Status[]) => {
  const tasks: Task[] = [];

  // 学生ユーザーのみを対象にタスクを生成
  const students = users.filter((user) => user.role === "STUDENT");

  // タスクの説明テンプレート
  const taskDescriptions = [
    "基本的な実装から始めて、段階的に機能を拡張していきます。",
    "ドキュメントを参照しながら、実装を進めていきます。",
    "エラーハンドリングも含めて、堅牢な実装を目指します。",
    "パフォーマンスも考慮した実装を心がけます。",
    "テストコードも含めて、品質の高い実装を目指します。",
  ];

  for (const student of students) {
    // 各学生に5-15個のタスクを生成
    const taskCount = getRandomInt(5, 15);

    for (let i = 0; i < taskCount; i++) {
      // タスクの基本情報生成
      const title =
        getRandomElement(japaneseData.taskTitles) + ` - ${student.name}`;
      const description =
        Math.random() > 0.3 ? getRandomElement(taskDescriptions) : null;
      const status = getRandomElement(statuses);
      const relatedChapter = Math.random() > 0.5 ? getRandomInt(1, 10) : null;

      // 日時の生成（過去30日から未来7日の範囲）
      const now = new Date();
      const createdAt = new Date(
        now.getTime() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000,
      );
      let startedAt = null;
      let endedAt = null;

      // ステータスに応じて開始・終了日時を設定
      if (status.name !== "作業中" && Math.random() > 0.3) {
        startedAt = new Date(
          createdAt.getTime() + getRandomInt(1, 24) * 60 * 60 * 1000,
        );

        if (status.name === "完了" && Math.random() > 0.2) {
          endedAt = new Date(
            startedAt.getTime() + getRandomInt(1, 72) * 60 * 60 * 1000,
          );
        }
      }

      const task = await prisma.task.create({
        data: {
          title,
          description,
          userId: student.id,
          statusId: status.id,
          relatedChapter,
          startedAt,
          endedAt,
          createdAt,
        },
      });

      tasks.push(task);
    }

    logProgress(
      `${student.name}のタスクを作成中`,
      tasks.length,
      students.length * 10,
    );
  }

  console.log(`✅ タスクを${tasks.length}件作成しました`);
  return tasks;
};

// タスク関連データ（タグ・アクティビティタイプ）の関連付け
const createTaskRelations = async (
  tasks: Task[],
  tags: Tag[],
  activityTypes: ActivityType[],
) => {
  let taskTagCount = 0;
  let taskActivityTypeCount = 0;

  for (const task of tasks) {
    // タグの関連付け（1-3個）
    const tagCount = getRandomInt(1, 3);
    const selectedTags = tags
      .sort(() => Math.random() - 0.5)
      .slice(0, tagCount);

    for (const tag of selectedTags) {
      await prisma.taskTag.create({
        data: {
          taskId: task.id,
          tagId: tag.id,
        },
      });
      taskTagCount++;
    }

    // アクティビティタイプの関連付け（1-2個）
    const activityTypeCount = getRandomInt(1, 2);
    const selectedActivityTypes = activityTypes
      .sort(() => Math.random() - 0.5)
      .slice(0, activityTypeCount);

    for (const activityType of selectedActivityTypes) {
      await prisma.taskActivityType.create({
        data: {
          taskId: task.id,
          activityTypeId: activityType.id,
        },
      });
      taskActivityTypeCount++;
    }
  }

  console.log(
    `✅ タスクタグを${taskTagCount}件、タスクアクティビティタイプを${taskActivityTypeCount}件作成しました`,
  );
};

// 学習ログデータ生成関数
const createLearningLogs = async (users: User[], tasks: Task[]) => {
  const learningLogs: LearningLog[] = [];
  const students = users.filter((user) => user.role === "STUDENT");

  for (const student of students) {
    // 各学生に10-30個の学習ログを生成
    const logCount = getRandomInt(10, 30);
    const studentTasks = tasks.filter((task) => task.userId === student.id);

    for (let i = 0; i < logCount; i++) {
      // 70%の確率でタスクに関連付け
      const isTaskRelated = Math.random() < 0.7 && studentTasks.length > 0;
      const task = isTaskRelated ? getRandomElement(studentTasks) : null;

      // 学習時間（15分-4時間）
      const spentMinutes = getRandomInt(15, 240);

      // タイトル、説明、振り返りの生成
      const title = getRandomElement(japaneseData.learningTitles);
      const description = getRandomElement(japaneseData.learningDescriptions);
      const reflections = getRandomElement(japaneseData.learningReflections);

      // 過去30日間のランダムな日時
      const createdAt = new Date(
        Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000,
      );

      // 開始・終了時刻の設定
      // 学習記録は通常、学習終了後に作成されるため、
      // endedAtをcreatedAtの少し前に設定
      const endedAt = new Date(
        createdAt.getTime() - getRandomInt(1, 10) * 60 * 1000, // 1-10分前
      );
      const startedAt = new Date(endedAt.getTime() - spentMinutes * 60 * 1000);

      const learningLog = await prisma.learningLog.create({
        data: {
          userId: student.id,
          taskId: task?.id || null,
          title,
          description,
          reflections,
          spentMinutes,
          startedAt,
          endedAt,
          createdAt,
        },
      });

      learningLogs.push(learningLog);
    }
  }

  console.log(`✅ 学習ログを${learningLogs.length}件作成しました`);
  return learningLogs;
};

// 講師-生徒関係データ生成関数
const createTeacherRelations = async (users: User[], tasks: Task[]) => {
  const teachers = users.filter(
    (user) => user.role === "TEACHER" || user.role === "TA",
  );
  const students = users.filter((user) => user.role === "STUDENT");
  let teacherStudentCount = 0;
  let teacherTaskCount = 0;
  const assignmentLogs: AssignmentLog[] = [];

  for (const teacher of teachers) {
    // 各講師が2-4名の生徒をブックマーク
    const studentCount = getRandomInt(2, Math.min(4, students.length));
    const selectedStudents = students
      .sort(() => Math.random() - 0.5)
      .slice(0, studentCount);

    for (const student of selectedStudents) {
      await prisma.teacherStudent.create({
        data: {
          teacherId: teacher.id,
          studentId: student.id,
        },
      });
      teacherStudentCount++;

      // その生徒のタスクからいくつかをブックマーク
      const studentTasks = tasks.filter((task) => task.userId === student.id);
      const taskCount = getRandomInt(1, Math.min(3, studentTasks.length));
      const selectedTasks = studentTasks
        .sort(() => Math.random() - 0.5)
        .slice(0, taskCount);

      for (const task of selectedTasks) {
        const resolved = Math.random() < 0.3; // 30%は解決済み

        await prisma.teacherTask.create({
          data: {
            teacherId: teacher.id,
            taskId: task.id,
            resolved,
          },
        });
        teacherTaskCount++;

        // 解決済みの場合は対応ログも生成
        if (resolved && Math.random() < 0.8) {
          try {
            // 既存のAssignmentLogをチェック
            const existingLog = await prisma.assignmentLog.findUnique({
              where: { taskId: task.id },
            });

            if (!existingLog) {
              const assignmentLog = await prisma.assignmentLog.create({
                data: {
                  taskId: task.id,
                  responderId: teacher.id,
                  description:
                    "タスクについて確認し、適切なアドバイスを行いました。実装方針について具体的な提案を行い、学習者の理解を深めることができました。",
                },
              });
              assignmentLogs.push(assignmentLog);
            }
          } catch (error) {
            console.warn(
              `AssignmentLog作成でエラー (taskId: ${task.id}):`,
              error,
            );
          }
        }
      }
    }
  }

  console.log(
    `✅ 講師-生徒関係を${teacherStudentCount}件、講師-タスク関係を${teacherTaskCount}件、対応ログを${assignmentLogs.length}件作成しました`,
  );
  return { teacherStudentCount, teacherTaskCount, assignmentLogs };
};

// データ検証関数
const validateData = async () => {
  console.log("\n🔍 データ検証を開始します...");

  const results = {
    users: await prisma.user.count(),
    tasks: await prisma.task.count(),
    statuses: await prisma.status.count(),
    tags: await prisma.tag.count(),
    activityTypes: await prisma.activityType.count(),
    taskTags: await prisma.taskTag.count(),
    taskActivityTypes: await prisma.taskActivityType.count(),
    learningLogs: await prisma.learningLog.count(),
    teacherStudents: await prisma.teacherStudent.count(),
    teacherTasks: await prisma.teacherTask.count(),
    assignmentLogs: await prisma.assignmentLog.count(),
  };

  // 整合性チェック
  const validationErrors: string[] = [];

  // ユーザーロールの検証
  const roleCount = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });

  for (const { role, _count } of roleCount) {
    if (_count === 0) {
      validationErrors.push(`${role}ロールのユーザーが0件です`);
    }
  }

  // タスクの整合性検証（日時の妥当性チェック）
  const allTasks = await prisma.task.findMany({
    where: {
      AND: [{ startedAt: { not: null } }, { endedAt: { not: null } }],
    },
  });

  const tasksWithInvalidDates = allTasks.filter((task) => {
    return task.startedAt! > task.endedAt!;
  });

  if (tasksWithInvalidDates.length > 0) {
    validationErrors.push(
      `開始日時が終了日時より後のタスクが${tasksWithInvalidDates.length}件あります`,
    );
  }

  // 学生以外のユーザーがcurrentChapterを持っていないか確認
  const nonStudentsWithChapter = await prisma.user.count({
    where: {
      role: { not: "STUDENT" },
      currentChapter: { not: null },
    },
  });

  if (nonStudentsWithChapter > 0) {
    validationErrors.push(
      `学生以外でcurrentChapterを持つユーザーが${nonStudentsWithChapter}件あります`,
    );
  }

  if (validationErrors.length > 0) {
    console.log("⚠️ データ検証で問題が見つかりました:");
    validationErrors.forEach((error) => console.log(`  - ${error}`));
  } else {
    console.log("✅ データ検証が正常に完了しました");
  }

  // 統計情報の表示
  console.log("\n📈 生成完了統計:");
  console.log(`- ユーザー: ${results.users}名`);
  console.log(`- タスク: ${results.tasks}件`);
  console.log(`- ステータス: ${results.statuses}件`);
  console.log(`- タグ: ${results.tags}件`);
  console.log(`- アクティビティタイプ: ${results.activityTypes}件`);
  console.log(`- タスクタグ: ${results.taskTags}件`);
  console.log(`- タスクアクティビティタイプ: ${results.taskActivityTypes}件`);
  console.log(`- 学習ログ: ${results.learningLogs}件`);
  console.log(`- 講師-生徒関係: ${results.teacherStudents}件`);
  console.log(`- 講師-タスク関係: ${results.teacherTasks}件`);
  console.log(`- 対応ログ: ${results.assignmentLogs}件`);

  return { validationErrors, results };
};

// メイン処理
const main = async () => {
  try {
    console.log("🌱 シードデータの生成を開始します...");

    // テストユーザの作成 ( Supabase に testUsers が存在しなければ作成 )
    console.log("🔐 Supabase認証ユーザーを作成中...");

    // まず全ての既存ユーザーをメールアドレスで検索
    const { data: allAuthUsers, error: listError } =
      await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("❌ 既存ユーザーリスト取得エラー:", listError);
    }

    const existingEmails = new Set(
      allAuthUsers?.users.map((u) => u.email) || [],
    );

    for (const user of testUsers) {
      try {
        if (existingEmails.has(user.email)) {
          // メールアドレスで既存ユーザーを検索
          const existingUser = allAuthUsers?.users.find(
            (u) => u.email === user.email,
          );
          if (existingUser) {
            console.log(
              `✅ Supabase認証ユーザー既存: ${user.email} (ID: ${existingUser.id})`,
            );
            // 既存ユーザーのIDをtestUsersに反映
            user.id = existingUser.id;
          }
        } else {
          // ユーザーが存在しない場合は作成（IDは指定しない）
          const { data, error: createError } =
            await supabase.auth.admin.createUser({
              email: user.email,
              password: user.password,
              email_confirm: true,
            });

          if (createError) {
            console.error(
              `❌ Supabase認証ユーザー作成エラー (${user.email}):`,
              createError,
            );
          } else if (data?.user) {
            console.log(
              `✅ Supabase認証ユーザー作成成功: ${user.email} (ID: ${data.user.id})`,
            );
            // 新しいIDをtestUsersに反映
            user.id = data.user.id;
          }
        }
      } catch (error) {
        console.error(
          `❌ Supabase認証ユーザー処理エラー (${user.email}):`,
          error,
        );
      }
    }

    // データクリア
    await clearData();

    // マスターデータの生成
    logProgress("マスターデータを生成中...");
    const { statuses, tags, activityTypes } = await createMasterData();

    // テストユーザーをアプリDBに作成（Supabase Authと連携）
    console.log("\n🔐 テストユーザーをアプリDBに作成中...");
    const userService = new UserService(prisma);
    const authUsers: User[] = [];

    for (const user of testUsers) {
      // UserService.createIfNotExistsを使用（運用フローと同じ方法）
      const wasCreated = await userService.createIfNotExists(
        user.id, // Supabase auth.users.id と同じIDを使用して紐付け
        user.email.split("@")[0], // 運用フローと同じく、emailの@前の部分を初期名として使用
      );

      if (wasCreated) {
        console.log(
          `✅ アプリDBユーザー作成完了: ${user.email} (ID: ${user.id})`,
        );
      } else {
        console.log(`ℹ️  アプリDBユーザー既存: ${user.email}`);
      }

      // テスト用に追加情報を更新（実際の運用では設定画面で更新される）
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name, // テスト用の日本語名
          role: user.role, // 指定されたロールに更新
          slackId: user.slackId,
          bio: "テストユーザーです（ログイン可能）",
          job: user.role === "STUDENT" ? "フロントエンド学習中" : 
               user.role === "TA" ? "学習サポート担当" :
               user.role === "TEACHER" ? "Web開発講師" :
               "システム管理者",
          currentChapter: user.role === "STUDENT" ? getRandomInt(1, 10) : null,
        },
      });
      authUsers.push(updatedUser);
      console.log(`   └─ テスト用情報を更新: ${user.name} (${user.role})`);
    }

    // 認証ユーザーのみを使用（ダミーユーザーは作成しない）
    const allUsers = authUsers;

    // タスクデータの生成
    logProgress("タスクデータを生成中...");
    const tasks = await createTasks(allUsers, statuses);

    // タスク関連データの生成
    logProgress("タスク関連データを生成中...");
    await createTaskRelations(tasks, tags, activityTypes);

    // 学習ログデータの生成
    logProgress("学習ログデータを生成中...");
    await createLearningLogs(allUsers, tasks);

    // 講師-生徒関係データの生成
    logProgress("講師-生徒関係データを生成中...");
    await createTeacherRelations(allUsers, tasks);

    // データ検証
    const { validationErrors } = await validateData();

    if (validationErrors.length === 0) {
      console.log("\n✅ シードデータの生成が正常に完了しました！");
    } else {
      console.log(
        "\n⚠️ シードデータの生成は完了しましたが、検証で問題が見つかりました",
      );
    }

    // 追加のテストデータ作成
    console.log("\n🔧 追加のテストタスクを作成中...");

    // Supabase認証ユーザーの確認（更新されたIDで確認）
    console.log("\n🔍 Supabase認証ユーザーの最終確認...");
    const { data: currentAuthUsers } = await supabase.auth.admin.listUsers();
    const currentEmails = new Map(
      currentAuthUsers?.users.map((u) => [u.email, u.id]) || [],
    );

    console.log("\n📊 認証状況サマリー:");
    console.log(`   └─ Supabase Auth: ${currentAuthUsers?.users.length || 0}名`);
    console.log(`   └─ アプリDB (合計): ${await prisma.user.count()}名`);
    console.log(`      - テストユーザー（ログイン可）: ${testUsers.length}名`);

    for (const user of testUsers) {
      const authId = currentEmails.get(user.email);
      if (authId) {
        console.log(`✅ 認証ユーザー確認: ${user.email} (ID: ${authId})`);
      } else {
        console.log(`❌ 認証ユーザー未作成: ${user.email}`);
      }
    }

    // テストタスクの作成（user3は作成しないため、user1とuser2のみ）
    const testUser1 = testUsers.find((u) => u.email === "user1@example.com");
    const testUser2 = testUsers.find((u) => u.email === "user2@example.com");

    if (testUser1) {
      await prisma.task.create({
        data: {
          userId: testUser1.id,
          title: "タスク01",
          description: "タスク01の説明",
          startedAt: new Date("2023-10-01T00:00:00.000Z"),
          endedAt: new Date("2023-10-01T23:59:59.999Z"),
        },
      });

      await prisma.task.create({
        data: {
          userId: testUser1.id,
          title: "タスク02",
          description: "タスク02の説明",
          startedAt: new Date("2023-10-02T00:00:00.000Z"),
          endedAt: new Date("2023-10-02T23:59:59.999Z"),
        },
      });
    }

    if (testUser2) {
      await prisma.task.create({
        data: {
          userId: testUser2.id,
          title: "タスク03",
          description: "タスク03の説明",
          startedAt: new Date("2023-10-02T00:00:00.000Z"),
          endedAt: new Date("2023-10-02T23:59:59.999Z"),
        },
      });
    }

    console.log("✅ 追加のテストタスク作成が完了しました");

    // 最終的な統計情報を表示
    console.log("\n📈 最終データ統計:");
    const finalStats = {
      users: await prisma.user.count(),
      tasks: await prisma.task.count(),
      learningLogs: await prisma.learningLog.count(),
      teacherStudents: await prisma.teacherStudent.count(),
      teacherTasks: await prisma.teacherTask.count(),
      assignmentLogs: await prisma.assignmentLog.count(),
      taskTags: await prisma.taskTag.count(),
      taskActivityTypes: await prisma.taskActivityType.count(),
    };
    
    console.log(`   └─ ユーザー: ${finalStats.users}名`);
    console.log(`   └─ タスク: ${finalStats.tasks}件`);
    console.log(`   └─ 学習ログ: ${finalStats.learningLogs}件`);
    console.log(`   └─ 講師-生徒関係: ${finalStats.teacherStudents}件`);
    console.log(`   └─ 講師-タスク関係: ${finalStats.teacherTasks}件`);
    console.log(`   └─ 対応ログ: ${finalStats.assignmentLogs}件`);
    console.log(`   └─ タスクタグ: ${finalStats.taskTags}件`);
    console.log(`   └─ タスクアクティビティタイプ: ${finalStats.taskActivityTypes}件`);
  } catch (error) {
    console.error("❌ シード処理中にエラーが発生しました:", error);
    throw error;
  }
};

// エラーハンドリングを含む実行
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
