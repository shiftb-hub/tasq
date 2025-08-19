import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/_components/ui/pagination";
import { useMemo } from "react";
import { cn } from "@/app/_libs/utils";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * 受講生用ページネーションコンポーネント
 * @description ShadcnUIを使用したページング機能
 */
export const StudentsPagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  const visiblePages = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // 総ページ数が少ない場合は全て表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 最初のページは常に表示
      pages.push(1);

      // 現在のページ周辺を表示
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // 省略記号を表示
      if (start > 2) pages.push("ellipsis");

      // 現在のページ周辺を表示
      for (let i = start; i <= end; i++) pages.push(i);

      // 省略記号を表示
      if (end < totalPages - 1) pages.push("ellipsis");

      // 最後のページは常に表示
      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  // 総ページ数が 1 以下の場合はページネーションを表示しない
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={cn(currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer")}
          />
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <PaginationItem key={page === "ellipsis" ? `ellipsis-${index}` : page}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={page === currentPage}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={cn(
              currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
