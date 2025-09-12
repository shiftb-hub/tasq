import prisma from "@/app/_libs/prisma";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";
import { LearningLogService, toAppLearningLog } from "@/app/_services/learningLogService";

// UIコンポーネント・アイコン
import { ErrorPage } from "@/app/_components/ErrorPage";
import { LearningLogUpdatePage } from "../_components/LearningLogUpdatePage";

// 型定義・バリデーションスキーマ
import { LearningLogNotFoundError, UserPermissionDeniedError } from "@/app/_libs/errors";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";

export const dynamic = "force-dynamic";

type RouteParams = { logId: string };
type Props = {
  params: Promise<RouteParams>;
};

const Page: React.FC<Props> = async ({ params }) => {
  try {
    const { logId } = await params;
    const { id: userId } = await authenticateAppUser();
    const learningLogService = new LearningLogService(prisma);
    const dbLearningLog = await learningLogService.getByIdWithOwnershipCheck(userId, logId);
    return <LearningLogUpdatePage initValues={toAppLearningLog(dbLearningLog)} />;
  } catch (e) {
    if (e instanceof LearningLogNotFoundError || e instanceof UserPermissionDeniedError)
      return <ErrorPage message="指定された学習ログは存在しないか、アクセス権がありません。" />;
    dumpError(e, "学習ログ");
    const errMsg = "学習ログの取得処理に失敗しました。しばらく時間をおいてから再試行してください。";
    return <ErrorPage message={errMsg} />;
  }
};

export default Page;
