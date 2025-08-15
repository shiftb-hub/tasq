"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/app/_components/ui/pagination";
import { PageInfo } from "@/app/_types/LearningLog";

const c_Dots = "ellipsis";

// ページ番号配リストを生成（数値 / c_Dots）
const buildPageItems = (
  current: number,
  totalPages: number,
  maxSlots = 7, // 表示ボタン数の最大値（c_Dots）を含む
): Array<number | typeof c_Dots> => {
  if (totalPages <= maxSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const first = 1;
  const last = totalPages;

  // 現在ページの前後にどれだけ出すか
  const windowSize = 2; // current の左右に出す数
  const start = Math.max(current - windowSize, 2);
  const end = Math.min(current + windowSize, totalPages - 1);

  const pages: Array<number | typeof c_Dots> = [first];

  // 左側の省略判定
  if (start > 2) {
    pages.push(c_Dots);
  } else {
    // 端に近い場合は詰めて表示
    for (let p = 2; p < start; p++) pages.push(p);
  }

  // 中央ウィンドウ
  for (let p = start; p <= end; p++) pages.push(p);

  // 右側の省略判定
  if (end < totalPages - 1) {
    pages.push(c_Dots);
  } else {
    for (let p = end + 1; p < totalPages; p++) pages.push(p);
  }

  pages.push(last);

  // 上限を大きく超えた場合の保険（ほぼ発生しないが念のため）
  if (pages.length > maxSlots) {
    // 端と current の近傍を優先して丸める簡易ロジック
    const keep = new Set<number>([
      first,
      last,
      ...Array.from(
        { length: windowSize * 2 + 1 },
        (_, i) => current - windowSize + i,
      ).filter((p) => p >= 1 && p <= totalPages),
    ]);
    const compact: Array<number | typeof c_Dots> = [];
    let prevAdded: number | typeof c_Dots | null = null;
    for (const it of pages) {
      if (it === c_Dots) {
        if (prevAdded !== c_Dots) compact.push(c_Dots);
        prevAdded = c_Dots;
      } else {
        if (keep.has(it) || it === first || it === last) {
          compact.push(it);
          prevAdded = it;
        } else if (prevAdded !== c_Dots) {
          compact.push(c_Dots);
          prevAdded = c_Dots;
        }
      }
    }
    return compact;
  }

  return pages;
};

type Props = {
  pageInfo: PageInfo;
  onPageChange: (page: number) => Promise<void>;
  disabled: boolean;
};

const c_Ghost = "ghost";
const c_Outline = "outline";

export const PaginationView: React.FC<Props> = ({
  pageInfo,
  onPageChange,
  disabled,
}) => {
  const { page, perPage, total } = pageInfo;

  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const changeTo = async (p: number) => {
    try {
      const clamped = Math.min(Math.max(1, p), totalPages);
      if (clamped !== page) {
        await onPageChange(clamped);
      }
    } catch (e) {
      console.error("Page change failed:", e);
    }
  };

  const pageItems = buildPageItems(page, totalPages);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <Pagination>
        <PaginationContent>
          {/* Prev */}
          <PaginationItem>
            <Button
              variant={c_Ghost}
              onClick={async () => await changeTo(page - 1)}
              disabled={!hasPrev || disabled}
              aria-label="Previous page"
            >
              &lt; Previous
            </Button>
          </PaginationItem>

          {/* すべてのページ番号（buildPageItemsの結果をそのまま使用） */}
          {pageItems.map((it, idx) =>
            it === c_Dots ? (
              <PaginationEllipsis key={`e-${idx}`} />
            ) : (
              <PaginationItem key={it}>
                <Button
                  variant={page === it ? c_Outline : c_Ghost}
                  onClick={async () => await changeTo(it)}
                  aria-current={page === it ? "page" : undefined}
                  disabled={disabled}
                >
                  {it}
                </Button>
              </PaginationItem>
            ),
          )}

          {/* Next */}
          <PaginationItem>
            <Button
              variant={c_Ghost}
              onClick={async () => await changeTo(page + 1)}
              disabled={!hasNext || disabled}
              aria-label="Next page"
            >
              Next &gt;
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
