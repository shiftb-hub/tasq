import { authenticateAppUser } from "@/app/_libs/authenticateUser";

// UIコンポーネント・アイコン
import { ErrorPage } from "@/app/_components/ErrorPage";
import { LearningLogPage } from "./_components/LearningLogPage";

// 型定義・バリデーションスキーマ
import { learningLogSearchParamsSchema } from "@/app/_types/LearningLog";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";
import prisma from "@/app/_libs/prisma";
import { LearningLogService } from "@/app/_services/learningLogService";

export const dynamic = "force-dynamic";

// prettier-ignore
const subTitles = [
  "成長の軌跡", "あなたの努力の証", "積み上げた日々", "未来への記録", "今日も1歩", 
  "マイペース更新中", "がんばった証拠", "地味にがんばる記録", "ゆるっと継続中",
  "昨日までのオレ超え", "忘れる前に書いとこ", "がんばりの裏側", "継続の天才（自称）"
];

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
    const learningLogService = new LearningLogService(prisma);
    const firstBatch = await learningLogService.getPaginatedBatch(appUser.id, page, per, order);

    const subtitle = subTitles[Math.floor(Math.random() * subTitles.length)];
    return <LearningLogPage batch={firstBatch} subtitle={subtitle} />;
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
