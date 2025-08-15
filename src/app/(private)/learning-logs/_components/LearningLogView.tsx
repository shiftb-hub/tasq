"use client";

// React と フォームライブラリ
import {
  useTransition,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";

// UIコンポーネント・アイコン
import { Button } from "@/app/_components/ui/button";
import { LearningLogTable } from "./LearningLogTable";
import { PaginationView } from "./PaginationView";
import { useLearningLogColumns } from "../_hooks/useLearningLogColumns";
import { MdOutlinePostAdd } from "react-icons/md";
import { Skeleton } from "@/app/_components/ui/skeleton";

// 型定義・バリデーションスキーマ
import type { LearningLog } from "@/app/_types/LearningLog";
import type { LearningLogsBatch, PageInfo } from "@/app/_types/LearningLog";
import { buildLearningLogsPageUrl } from "../_helpers/buildLearningLogsPageUrl";

// ユーティリティ
import { cn } from "@/app/_libs/utils";

// prettier-ignore
const subTitles = [
  "成長の軌跡", "あなたの努力の証", "積み上げた日々", "未来への記録", "今日も1歩", 
  "マイペース更新中", "がんばった証拠", "地味にがんばる記録", "ゆるっと継続中",
  "昨日までのオレ超え", "忘れる前に書いとこ", "がんばりの裏側", "継続の天才（自称）"
];

type Props = {
  batch: LearningLogsBatch;
};

export const LearningLogView: React.FC<Props> = ({ batch }) => {
  const router = useRouter();
  const [logs, setLogs] = useState<LearningLog[]>(batch.learningLogs);
  const [pageInfo, setPageInfo] = useState<PageInfo>(batch.pageInfo);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(batch.sortOrder);
  const [subTitle, setRandomSubTitle] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  // Hydration Error 回避
  useEffect(() => {
    setRandomSubTitle(
      `～ ${subTitles[Math.floor(Math.random() * subTitles.length)]} ～`,
    );
  }, []);

  useEffect(() => {
    setLogs(batch.learningLogs);
    setPageInfo(batch.pageInfo);
    setSortOrder(batch.sortOrder);
  }, [batch.learningLogs, batch.pageInfo, batch.sortOrder]);

  const onEdit = useCallback(async (id: string) => {
    // TODO: Implement edit action in another branch
    // NOTE: Temporary console output for verification — remove before production
    console.log("[DEV] Edit action for log ID:", id);
  }, []);

  const onDelete = useCallback(async (id: string) => {
    // TODO: Implement edit action in another branch
    // NOTE: Temporary console output for verification — remove before production
    console.log("[DEV] Delete action for log ID:", id);
  }, []);

  const onNewLearningLog = useCallback(async () => {
    // TODO: Implement create learning log action in another branch
    // NOTE: Temporary console output for verification — remove before production
    console.log("[DEV] New learning log creation");
  }, []);

  const onPageChange = useCallback(
    async (page: number) => {
      if (isPending) return;
      try {
        const href = buildLearningLogsPageUrl(
          page,
          sortOrder,
          pageInfo.perPage,
        );
        startTransition(() => {
          router.replace(href, { scroll: false });
        });
      } catch (e) {
        console.error("ページネーションに失敗。", e);
      }
    },
    [isPending, pageInfo.perPage, router, sortOrder],
  );

  const columns = useLearningLogColumns({
    onEdit,
    onDelete,
    disabled: isPending,
  });

  const paginationInfo = useMemo(() => {
    const hasAny = pageInfo.total > 0;
    const from = hasAny ? (pageInfo.page - 1) * pageInfo.perPage + 1 : 0;
    const to = hasAny
      ? Math.min(pageInfo.page * pageInfo.perPage, pageInfo.total)
      : 0;
    return { hasAny, from, to };
  }, [pageInfo.total, pageInfo.page, pageInfo.perPage]);

  return (
    <>
      <div className="flex flex-col items-center gap-y-0.5">
        {/* サブタイトルも設定する関係で PageTitleコンポーネントを使用しない */}
        <h1 className="text-3xl font-bold">学習ログ一覧</h1>
        {subTitle ? (
          <h2 className="text-muted-foreground">{subTitle}</h2>
        ) : (
          <Skeleton className="h-7 w-64" />
        )}
      </div>

      <div className="flex flex-row justify-end">
        <Button
          size="sm"
          aria-label="学習ログを追加"
          onClick={onNewLearningLog}
          disabled={isPending} // ローディング中は無効化
        >
          <MdOutlinePostAdd />
          学習ログを追加
        </Button>
      </div>

      <div className="text-muted-foreground my-1 mr-1 text-xs">
        {`全 ${pageInfo.total} 件中 ${paginationInfo.from}-${paginationInfo.to} 件を表示`}
      </div>

      <LearningLogTable columns={columns} data={logs} disabled={isPending} />

      <PaginationView
        pageInfo={pageInfo}
        onPageChange={onPageChange}
        disabled={isPending}
      />
    </>
  );
};
