"use client";

// React ライブラリ
import { useState, useMemo, useCallback, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiBookOpen,
  FiStar,
  FiAlertCircle,
  FiCheckCircle,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

// UIコンポーネント
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";

// ローカルコンポーネント
import { PaginationView } from "@/app/_components/PaginationView";
import { buildStudentsPageUrl } from "../_helpers/buildStudentsPageUrl";
import {
  parseStudentsQueryParams,
  STUDENTS_TABLE_DEFAULTS,
  type SortableField,
  type SortDirection,
} from "../_helpers/parseStudentsQueryParams";
import { TaskTrend } from "./TaskTrend";
import { ToggleFavoriteResult } from "@/app/_types/Student";
import { useAvatarUrl } from "@/app/_hooks/useAvatarUrl";

interface Student {
  id: string;
  name: string;
  profileImageKey: string | null;
  role: string;
  currentChapter: number;
  slackId: string | null;
  favorite: boolean;
  totalTasks: number;
  stuckTasks: number;
  stuckTasksTrend: number;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  /** フィルタリング済みの受講生データ */
  students: Student[];
  /** お気に入り切り替えのServer Action */
  onToggleFavorite?: (studentId: string) => Promise<ToggleFavoriteResult>;
}

const StudentAvatar: React.FC<{ name: string; imageKey: string | null }> = ({ name, imageKey }) => {
  const avatarUrl = useAvatarUrl(imageKey);
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

/**
 * 受講生テーブル表示コンポーネント
 * @description 受講生の一覧をテーブル形式で表示し、ページネーション機能を提供
 */
export const StudentsTable = ({ students, onToggleFavorite }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // URLクエリから初期値を復元（存在しない場合はデフォルト）
  const {
    page: initialPage,
    sortField: initialSortField,
    sortDirection: initialSortDirection,
  } = parseStudentsQueryParams(searchParams);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(students.filter((student) => student.favorite).map((student) => student.id)),
  );
  const [sortField, setSortField] = useState<SortableField>(initialSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);

  // URL の変更に合わせて state を同期（戻る/進むに追従）
  useEffect(() => {
    const { page, sortField, sortDirection } = parseStudentsQueryParams(searchParams);

    setCurrentPage(page);
    setSortField(sortField);
    setSortDirection(sortDirection);
  }, [searchParams]);

  // 1ページあたりの表示件数
  const itemsPerPage = STUDENTS_TABLE_DEFAULTS.ITEMS_PER_PAGE;

  /**
   * お気に入り状態を切り替える
   * @param studentId - 受講生ID
   */
  const toggleFavorite = async (studentId: string) => {
    // 楽観的更新
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });

    if (!onToggleFavorite) return;

    try {
      const res = await onToggleFavorite(studentId);
      // サーバー結果と同期
      setFavorites((prev) => {
        const next = new Set(prev);
        if (res.favorite) next.add(studentId);
        else next.delete(studentId);
        return next;
      });
    } catch (e) {
      // 失敗時はロールバック
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(studentId)) next.delete(studentId);
        else next.add(studentId);
        return next;
      });
    }
  };

  /**
   * ソート処理
   * @param field - ソート対象のフィールド
   */
  const handleSort = useCallback(
    (field: SortableField) => {
      const isSame = sortField === field;
      const nextDir: SortDirection = isSame ? (sortDirection === "asc" ? "desc" : "asc") : "desc";
      const nextField: SortableField = field;
      const nextPage = 1;

      startTransition(() => {
        setSortField(nextField);
        setSortDirection(nextDir);
        setCurrentPage(nextPage);
        const href = buildStudentsPageUrl(nextPage, nextField, nextDir, itemsPerPage);
        router.replace(href, { scroll: false });
      });
    },
    [sortField, sortDirection, itemsPerPage, router],
  );

  /**
   * ソート済み受講生データ
   * @description フィルタリング済みデータをソートして返す
   */
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      switch (sortField) {
        case "currentChapter":
          valueA = a.currentChapter;
          valueB = b.currentChapter;
          break;
        case "stuckTasks":
          valueA = a.stuckTasks;
          valueB = b.stuckTasks;
          break;
        case "stuckTasksTrend":
          valueA = a.stuckTasksTrend;
          valueB = b.stuckTasksTrend;
          break;
        case "totalTasks":
          valueA = a.totalTasks;
          valueB = b.totalTasks;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [students, sortField, sortDirection]);

  /**
   * ページネーション
   * @description ソート済みの受講生をページごとに分割
   */
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(
    () => sortedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [sortedStudents, currentPage, itemsPerPage],
  );

  /**
   * ページ変更ハンドラー
   * @param page - 移動先のページ番号
   */
  const handlePageChange = useCallback(
    async (page: number) => {
      if (isPending) return;
      // NaN や無効な値に対するガードを追加
      const validPage = Number.isFinite(page) ? page : 1;
      const clamped = Math.max(1, Math.min(validPage, totalPages));
      startTransition(() => {
        setCurrentPage(clamped);
        const href = buildStudentsPageUrl(clamped, sortField, sortDirection, itemsPerPage);
        router.replace(href, { scroll: false });
      });
    },
    [isPending, totalPages, sortField, sortDirection, itemsPerPage, router],
  );

  // 件数表示用の計算（LearningLogPageの表示形式に合わせる）
  const paginationInfo = useMemo(() => {
    const total = sortedStudents.length;
    const hasAny = total > 0;
    const from = hasAny ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const to = hasAny ? Math.min(currentPage * itemsPerPage, total) : 0;
    return { total, from, to };
  }, [sortedStudents.length, currentPage, itemsPerPage]);

  // PaginationView へ渡す pageInfo（useMemo で安定化）
  const pageInfo = useMemo(
    () => ({ page: currentPage, perPage: itemsPerPage, total: sortedStudents.length }),
    [currentPage, itemsPerPage, sortedStudents.length],
  );

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground my-1 mr-1 text-xs">
        {`全 ${paginationInfo.total} 件中 ${paginationInfo.from}-${paginationInfo.to} 件を表示`}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">受講生</TableHead>
                <TableHead>SlackID</TableHead>
                <TableHead
                  className={`cursor-pointer transition-colors select-none hover:bg-gray-50 ${
                    sortField === "currentChapter" ? "bg-blue-50 font-semibold text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("currentChapter")}
                >
                  <div className="flex items-center gap-2">
                    取組中の章
                    {sortField === "currentChapter" ? (
                      sortDirection === "asc" ? (
                        <FiChevronUp className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FiChevronDown className="h-4 w-4 text-blue-600" />
                      )
                    ) : (
                      <div className="h-4 w-4 opacity-30">
                        <FiChevronUp className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className={`cursor-pointer transition-colors select-none hover:bg-gray-50 ${
                    sortField === "stuckTasks" ? "bg-blue-50 font-semibold text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("stuckTasks")}
                >
                  <div className="flex items-center gap-2">
                    困っているタスク
                    {sortField === "stuckTasks" ? (
                      sortDirection === "asc" ? (
                        <FiChevronUp className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FiChevronDown className="h-4 w-4 text-blue-600" />
                      )
                    ) : (
                      <div className="h-4 w-4 opacity-30">
                        <FiChevronUp className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className={`cursor-pointer transition-colors select-none hover:bg-gray-50 ${
                    sortField === "stuckTasksTrend" ? "bg-blue-50 font-semibold text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("stuckTasksTrend")}
                >
                  <div className="flex items-center gap-2">
                    お困りタスク動向
                    {sortField === "stuckTasksTrend" ? (
                      sortDirection === "asc" ? (
                        <FiChevronUp className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FiChevronDown className="h-4 w-4 text-blue-600" />
                      )
                    ) : (
                      <div className="h-4 w-4 opacity-30">
                        <FiChevronUp className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className={`cursor-pointer transition-colors select-none hover:bg-gray-50 ${
                    sortField === "totalTasks" ? "bg-blue-50 font-semibold text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("totalTasks")}
                >
                  <div className="flex items-center gap-2">
                    全タスク数
                    {sortField === "totalTasks" ? (
                      sortDirection === "asc" ? (
                        <FiChevronUp className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FiChevronDown className="h-4 w-4 text-blue-600" />
                      )
                    ) : (
                      <div className="h-4 w-4 opacity-30">
                        <FiChevronUp className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </TableHead>
                <TableHead>お気に入り</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <StudentAvatar name={student.name} imageKey={student.profileImageKey} />
                      <div>
                        <Link
                          href={`/teacher/${student.id}`}
                          className="font-medium hover:underline"
                        >
                          {student.name}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{student.slackId ?? "未設定"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FiBookOpen className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">{student.currentChapter}章</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {student.stuckTasks > 0 ? (
                        <>
                          <FiAlertCircle className="h-4 w-4 text-red-500" />
                          <Badge variant="destructive" className="text-xs">
                            {student.stuckTasks}
                          </Badge>
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground text-sm">0</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TaskTrend trend={student.stuckTasksTrend} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{student.totalTasks}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(student.id)}
                      className="h-8 w-8 p-0"
                    >
                      <FiStar
                        className={`h-4 w-4 ${
                          favorites.has(student.id)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground hover:text-yellow-500"
                        }`}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ページネーション */}
      <PaginationView pageInfo={pageInfo} onPageChange={handlePageChange} disabled={isPending} />
    </div>
  );
};
