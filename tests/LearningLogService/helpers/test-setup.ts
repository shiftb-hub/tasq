import { UserService } from "@/app/_services/userService";
import { LearningLogService } from "@/app/_services/learningLogService";
import type { DbClient } from "@/app/_types/Services";
import type { LearningLogInsertRequest } from "@/app/_types/LearningLog";
import { v4 as uuid } from "uuid";

type TestUser = {
  id: string;
  name: string;
};

/**
 * テスト用ユーザーを作成
 */
export const createTestUser = async (
  tx: DbClient,
  name: string = "検査 官太郎",
): Promise<TestUser> => {
  const id = uuid();
  const userService = new UserService(tx);
  await userService.createAsStudent(id, name);
  return { id, name } satisfies TestUser;
};

// 指定ユーザーの学習ログを一括作成
export const createBulkLearningLogs = async (
  tx: DbClient,
  userId: string,
  logDataArray: LearningLogInsertRequest[],
): Promise<void> => {
  const learningLogService = new LearningLogService(tx);
  for (const logData of logDataArray) {
    await learningLogService.create(userId, logData);
  }
};

// 複数のユーザを作成し、各ユーザーの学習ログを一括作成
export const setupMultipleUsersWithLogs = async (
  tx: DbClient,
  userConfigs: Array<{
    userName: string;
    logCount: number;
    startIndex?: number;
  }>,
  dummyLogs: LearningLogInsertRequest[],
): Promise<TestUser[]> => {
  const users: TestUser[] = [];

  for (const config of userConfigs) {
    const user = await createTestUser(tx, config.userName);
    users.push(user);

    const startIndex = config.startIndex || 0;
    const logsToCreate = dummyLogs.slice(
      startIndex,
      startIndex + config.logCount,
    );
    await createBulkLearningLogs(tx, user.id, logsToCreate);
  }

  return users;
};
