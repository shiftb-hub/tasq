// 実行方法 → npx prisma db seed
import { PrismaClient, Role } from "@prisma/client";

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

type StudyLog = {
  id: string;
  userId: string;
  taskId?: string | null;
  time: number;
  summary?: string | null;
  trouble?: string | null;
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

// 開発用のテストユーザの定義
const testUsers = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "user1@example.com",
    password: "##user1",
    name: "構文 誤次郎",
    role: Role.STUDENT,
    slackId: "@user1",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "user2@example.com",
    password: "##user2",
    name: "仕様 曖昧子",
    role: Role.STUDENT,
    slackId: "@user2",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "user3@example.com",
    password: "##user3",
    name: "保守 絶望太",
    role: Role.STUDENT,
    slackId: "@user3",
  },
];

// データクリア処理（外部キー制約を考慮した順序）
const clearData = async () => {
  console.log("🗑️ 既存データをクリアしています...");

  try {
    // 依存関係の順序でデータを削除（外部キー制約を考慮）
    console.log("📝 AssignmentLogを削除中...");
    await prisma.assignmentLog.deleteMany();

    console.log("📝 StudyLogを削除中...");
    await prisma.studyLog.deleteMany();

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

  // 学習ログの要約テンプレート
  studySummaries: [
    "コンポーネントの実装方法について理解が深まった",
    "エラーハンドリングの重要性を学んだ",
    "非同期処理の扱い方が分かってきた",
    "デザインパターンについて新しい知識を得た",
    "デバッグ手法を身につけることができた",
  ],

  // 困ったことのテンプレート
  troubles: [
    "型エラーの解決に時間がかかった",
    "想定通りの動作にならず原因を探るのが大変だった",
    "ドキュメントの内容が理解しづらかった",
    "実装方針で迷いが生じた",
    "パフォーマンスの改善方法が分からなかった",
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

// ユーザーデータ生成関数
const createUsers = async () => {
  const users: User[] = [];

  // SNSアカウントのテンプレート
  const snsAccountTemplates = {
    slack: ["user", "dev", "eng", "tech"],
    instagram: ["_dev", "_tech", "_code", "_engineer"],
    threads: ["threads", "_th", "_user", "_dev"],
    github: ["developer", "-dev", "_code", "-engineer"],
    x: ["_dev", "_tech", "_engineer", "_code"],
  };

  // 職業のテンプレート
  const jobs: Record<Role, string[]> = {
    STUDENT: [
      "フロントエンド学習中",
      "バックエンド学習中",
      "フルスタック目指し中",
      "Web開発勉強中",
    ],
    TA: [
      "フロントエンドレビュワー",
      "バックエンドレビュワー",
      "コードレビュー担当",
      "学習サポート担当",
    ],
    TEACHER: [
      "フロントエンド講師",
      "バックエンド講師",
      "フルスタック講師",
      "Web開発講師",
    ],
    ADMIN: ["システム管理者", "プラットフォーム管理者", "運営管理者"],
  };

  // 自己紹介のテンプレート
  const bioTemplates: Record<Role, string[]> = {
    STUDENT: [
      "プログラミング初心者です。日々学習を頑張っています！",
      "Web開発を学んでいます。新しいことを学ぶのが楽しいです。",
      "エンジニアを目指して勉強中。コツコツ頑張ります。",
      "フロントエンドに興味があります。UI/UXも勉強したいです。",
    ],
    TA: [
      "学習者の皆さんをサポートします。気軽に質問してください！",
      "コードレビューを通じて、より良い実装を一緒に考えましょう。",
      "プログラミングの楽しさを伝えたいです。",
      "困ったことがあれば、遠慮なく相談してください。",
    ],
    TEACHER: [
      "実務経験を活かした実践的な指導を心がけています。",
      "プログラミングの基礎から応用まで幅広くサポートします。",
      "エンジニアとしての考え方を大切に指導しています。",
      "学習者の成長を第一に考えた指導を行います。",
    ],
    ADMIN: [
      "プラットフォームの運営管理を担当しています。",
      "皆様が快適に学習できる環境づくりに努めています。",
      "システムの安定運用を心がけています。",
      "ユーザーの皆様のフィードバックを大切にしています。",
    ],
  };

  // 各ロールごとにユーザーを生成
  const roles: Role[] = ["STUDENT", "TA", "TEACHER", "ADMIN"];
  const userCounts: Record<Role, number> = {
    STUDENT: 5,
    TA: 3,
    TEACHER: 3,
    ADMIN: 1,
  };

  for (const role of roles) {
    const count = userCounts[role];

    for (let i = 0; i < count; i++) {
      const gender = Math.random() > 0.5 ? "male" : "female";
      const name = generateJapaneseName(gender);
      const userId = `${role.toLowerCase()}-${i + 1}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // SNSアカウントの生成（ランダムに2-3個）
      const snsAccounts: Record<string, string | null> = {};
      const snsKeys = Object.keys(snsAccountTemplates);
      const selectedSns = snsKeys
        .sort(() => Math.random() - 0.5)
        .slice(0, getRandomInt(2, 3));

      selectedSns.forEach((sns) => {
        const template = getRandomElement(
          snsAccountTemplates[sns as keyof typeof snsAccountTemplates],
        );
        snsAccounts[`${sns}Id`] = `${template}${i + 1}`;
      });

      // Prismaでユーザーを作成
      const user = await prisma.user.create({
        data: {
          id: userId,
          name,
          role,
          job: getRandomElement(jobs[role]),
          bio: getRandomElement(bioTemplates[role]),
          currentChapter: role === "STUDENT" ? getRandomInt(1, 10) : null,
          slackId: snsAccounts.slackId || null,
          instagramId: snsAccounts.instagramId || null,
          threadsId: snsAccounts.threadsId || null,
          githubId: snsAccounts.githubId || null,
          xId: snsAccounts.xId || null,
        },
      });

      users.push(user);
      logProgress(`${role}ユーザーを作成中`, i + 1, count);
    }
  }
  console.log(`✅ ユーザーを${users.length}名作成しました`);
  return users;
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
const createStudyLogs = async (users: User[], tasks: Task[]) => {
  const studyLogs: StudyLog[] = [];
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
      const time = getRandomInt(15, 240);

      // 要約と困ったことの生成（80%の確率で記入）
      const summary =
        Math.random() < 0.8
          ? getRandomElement(japaneseData.studySummaries)
          : null;
      const trouble =
        Math.random() < 0.8 ? getRandomElement(japaneseData.troubles) : null;

      // 過去30日間のランダムな日時
      const createdAt = new Date(
        Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000,
      );

      const studyLog = await prisma.studyLog.create({
        data: {
          userId: student.id,
          taskId: task?.id || null,
          time,
          summary,
          trouble,
          createdAt,
        },
      });

      studyLogs.push(studyLog);
    }
  }

  console.log(`✅ 学習ログを${studyLogs.length}件作成しました`);
  return studyLogs;
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
    studyLogs: await prisma.studyLog.count(),
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
  console.log(`- 学習ログ: ${results.studyLogs}件`);
  console.log(`- 講師-生徒関係: ${results.teacherStudents}件`);
  console.log(`- 講師-タスク関係: ${results.teacherTasks}件`);
  console.log(`- 対応ログ: ${results.assignmentLogs}件`);

  return { validationErrors, results };
};

// メイン処理
const main = async () => {
  try {
    // データクリア
    await clearData();

    console.log("🌱 シードデータの生成を開始します...");

    // マスターデータの生成
    logProgress("マスターデータを生成中...");
    const { statuses, tags, activityTypes } = await createMasterData();

    // ユーザーデータの生成
    logProgress("ユーザーデータを生成中...");
    const users = await createUsers();

    // タスクデータの生成
    logProgress("タスクデータを生成中...");
    const tasks = await createTasks(users, statuses);

    // タスク関連データの生成
    logProgress("タスク関連データを生成中...");
    await createTaskRelations(tasks, tags, activityTypes);

    // 学習ログデータの生成
    logProgress("学習ログデータを生成中...");
    await createStudyLogs(users, tasks);

    // 講師-生徒関係データの生成
    logProgress("講師-生徒関係データを生成中...");
    await createTeacherRelations(users, tasks);

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
    console.log("🔧 追加のテストデータを作成中...");

    // テストユーザーの作成（既存のユーザーに追加）
    for (const user of testUsers) {
      if (user.id === "33333333-3333-3333-3333-333333333333") continue;

      // 既存ユーザーをチェック
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            role: user.role,
            slackId: user.slackId,
            bio: "テストユーザーです",
          },
        });
      }
    }

    // テストタスクの作成
    await prisma.task.create({
      data: {
        userId: testUsers[0].id,
        title: "タスク01",
        description: "タスク01の説明",
        startedAt: new Date("2023-10-01T00:00:00.000Z"),
        endedAt: new Date("2023-10-01T23:59:59.999Z"),
      },
    });

    await prisma.task.create({
      data: {
        userId: testUsers[0].id,
        title: "タスク02",
        description: "タスク02の説明",
        startedAt: new Date("2023-10-02T00:00:00.000Z"),
        endedAt: new Date("2023-10-02T23:59:59.999Z"),
      },
    });

    await prisma.task.create({
      data: {
        userId: testUsers[1].id,
        title: "タスク03",
        description: "タスク03の説明",
        startedAt: new Date("2023-10-02T00:00:00.000Z"),
        endedAt: new Date("2023-10-02T23:59:59.999Z"),
      },
    });

    console.log("✅ 追加のテストデータ作成が完了しました");
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
