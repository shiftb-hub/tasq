import { PrismaClient, Prisma } from "@prisma/client";
import { afterAll } from "vitest";

export const prisma = new PrismaClient();

class TxRollback extends Error {
  constructor() {
    super("__ROLLBACK__");
  }
}

/**
 * 各テストをインタラクティブトランザクションで実行し、
 * 最後に必ずロールバックさせる（ダミー例外で中断）。
 */
export async function runInRollbackTx<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  let result: T | undefined;
  try {
    await prisma.$transaction(async (tx) => {
      result = await fn(tx);
      throw new TxRollback();
    });
  } catch (e) {
    if (e instanceof TxRollback) return result as T;
    throw e;
  }
  // フォールスルー防止（理論上ここには到達しない）
  throw new Error("runInRollbackTx: unreachable (no rollback thrown?)");
}

afterAll(async () => {
  await prisma.$disconnect();
});
