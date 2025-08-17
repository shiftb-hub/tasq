import { describe, expect, test, vitest } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { UserService } from "@/app/_services/userService";
import { Role } from "@prisma/client";

describe("UserService", () => {
  test("受講生ロールのユーザーの新規作成", async () => {
    await runInRollbackTx(async (tx) => {
      const userService = new UserService(tx);

      const initUserNum = await userService.count();

      // ユーザ（受講生）の新規作成
      const id = "cccccccc-cccc-cccc-cccc-cccccccccccc";
      const name = "検査 官太郎";
      await userService.createAsStudent(id, name);
      expect(await userService.count()).toBe(initUserNum + 1);

      const user = await userService.getById(id);
      expect(user).toBeDefined();
      expect(user.id).toBe(id);
      expect(user.name).toBe(name);
      expect(user.role).toBe(Role.STUDENT);

      // runInRollbackTxを抜けるタイミングで自動で意図的な例外が発生してロールバックされる
    });
  });
});
