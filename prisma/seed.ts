// 実行方法 → npx prisma db seed

import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

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

const main = async () => {
  // Supabaseクライアント (ServiceRole) の作成
  const supabase = createClient(
    "http://localhost:54321",
    process.env.SB_SERVICE_ROLE_KEY!,
  );

  // テストユーザの作成 ( Supabase に testUsers が存在しなければ作成 )
  for (const user of testUsers) {
    const { error } = await supabase.auth.admin.getUserById(user.id);
    if (error) {
      await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        password: user.password,
        email_confirm: true,
      });
    }
  }

  // 既存の全レコードを削除
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Userレコードの挿入
  for (const user of testUsers) {
    if (user.id === "33333333-3333-3333-3333-333333333333") continue;
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        slackId: user.slackId,
      },
    });
  }

  // Taskレコードの挿入
  const task0 = await prisma.task.create({
    data: {
      userId: testUsers[0].id,
      title: "タスク01",
      description: "タスク01の説明",
      startedAt: new Date("2023-10-01T00:00:00.000Z"),
      endedAt: new Date("2023-10-01T23:59:59.999Z"),
    },
  });

  const task1 = await prisma.task.create({
    data: {
      userId: testUsers[0].id,
      title: "タスク02",
      description: "タスク02の説明",
      startedAt: new Date("2023-10-02T00:00:00.000Z"),
      endedAt: new Date("2023-10-02T23:59:59.999Z"),
    },
  });

  const task2 = await prisma.task.create({
    data: {
      userId: testUsers[1].id,
      title: "タスク03",
      description: "タスク03の説明",
      startedAt: new Date("2023-10-02T00:00:00.000Z"),
      endedAt: new Date("2023-10-02T23:59:59.999Z"),
    },
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
