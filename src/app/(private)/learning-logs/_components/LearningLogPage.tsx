"use client";

// React と フォームライブラリ
import { useTransition, useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// UIコンポーネント・アイコン
import { PageTitle } from "@/app/_components/PageTitle";
import { PageSubTitle } from "@/app/_components/PageSubTitle";
import { Button } from "@/app/_components/ui/button";
import { LearningLogTable } from "./LearningLogTable";
import { PaginationView } from "./PaginationView";
import { useLearningLogColumns } from "../_hooks/useLearningLogColumns";
import { MdOutlinePostAdd } from "react-icons/md";

// 型定義・バリデーションスキーマ
import type { LearningLog } from "@/app/_types/LearningLog";
import type { LearningLogsBatch, PageInfo } from "@/app/_types/LearningLog";
import { buildLearningLogsPageUrl } from "../_helpers/buildLearningLogsPageUrl";

type Props = {
  batch: LearningLogsBatch;
  subtitle: string;
};

export const LearningLogPage: React.FC<Props> = ({ batch, subtitle }) => {
  const router = useRouter();
  const [logs, setLogs] = useState<LearningLog[]>(batch.learningLogs);
  const [pageInfo, setPageInfo] = useState<PageInfo>(batch.pageInfo);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(batch.sortOrder);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLogs(batch.learningLogs);
    setPageInfo(batch.pageInfo);
    setSortOrder(batch.sortOrder);
  }, [batch.learningLogs, batch.pageInfo, batch.sortOrder]);

  const onEdit = useCallback(
    async (id: string) => {
      router.push(`/learning-logs/${id}`);
    },
    [router],
  );

  const onDelete = useCallback(async (id: string) => {
    // TODO: Implement delete action in another branch
    // NOTE: Temporary console output for verification — remove before production
    console.log("[DEV] Delete action for log ID:", id);
  }, []);

  const onNewLearningLog = useCallback(async () => {
    router.push("/learning-logs/new");
  }, [router]);

  const onPageChange = useCallback(
    async (page: number) => {
      if (isPending) return;
      try {
        const href = buildLearningLogsPageUrl(page, sortOrder, pageInfo.perPage);
        startTransition(() => {
          router.replace(href, { scroll: false });
        });
      } catch (e) {
        console.error("ページネーション処理に失敗。", e);
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
    const to = hasAny ? Math.min(pageInfo.page * pageInfo.perPage, pageInfo.total) : 0;
    return { hasAny, from, to };
  }, [pageInfo.total, pageInfo.page, pageInfo.perPage]);

  return (
    <div className="mx-auto my-4 w-full max-w-4xl space-y-4 px-4 2xl:px-0">
      <div>
        <PageTitle className="mb-2">学習ログ</PageTitle>
        <PageSubTitle>～ {subtitle} ～</PageSubTitle>
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

      <PaginationView pageInfo={pageInfo} onPageChange={onPageChange} disabled={isPending} />
    </div>
  );
};
