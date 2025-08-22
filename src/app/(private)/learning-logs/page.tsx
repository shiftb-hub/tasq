import { authenticateAppUser } from "@/app/_libs/authenticateUser";

// UIコンポーネント・アイコン
import { ErrorPage } from "@/app/_components/ErrorPage";
import { LearningLogView } from "./_components/LearningLogView";

// 型定義・バリデーションスキーマ
import { learningLogSearchParamsSchema } from "@/app/_types/LearningLog";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";
import { getMockLearningLogsResponse } from "./_mock/getMockLearningLogsResponse";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };
type Props = {
  searchParams: Promise<SearchParams>;
};

const Page: React.FC<Props> = async ({ searchParams }) => {
  try {
    // 認証（問題があれば例外が発生）
    const appUser = await authenticateAppUser();

    // クエリパラメータの処理 [例] /learning-logs?page=1&per=5&order=desc
    const params = await searchParams;
    const { page, per, order } = learningLogSearchParamsSchema.parse({
      page: params?.page,
      per: params?.per,
      order: params?.order,
    });

    // 学習ログの初期ページングデータ（バッチ）を取得
    // TODO: Implement learning log fetch in another branch
    const firstBatch = getMockLearningLogsResponse(page, per, order);

    return <LearningLogView batch={firstBatch} />;
  } catch (e) {
    dumpError(e, "学習ログ");
    const errMsg =
      e instanceof Error
        ? `学習ログの取得に失敗しました: ${e.message}`
        : "学習ログの取得に失敗しました。しばらく時間をおいてから再試行してください。";
    return <ErrorPage message={errMsg} />;
  }
};

export default Page;
