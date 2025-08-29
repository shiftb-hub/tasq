"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";
import {
  FiBookOpen,
  FiStar,
  FiAlertCircle,
  FiCheckCircle,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { TaskTrend } from "./TaskTrend";
import { StudentsPagination } from "./StudentsPagination";

interface Student {
  id: string;
  name: string;
  profileImageKey: string | null;
  role: string;
  currentChapter: number;
  slackId: string;
  favorite: boolean;
  totalTasks: number;
  stuckTasks: number;
  stuckTasksTrend: number;
  createdAt: string;
  updatedAt: string;
}

type SortableField = "currentChapter" | "stuckTasks" | "stuckTasksTrend" | "totalTasks";
type SortDirection = "asc" | "desc";

interface Props {
  /** フィルタリング済みの受講生データ */
  students: Student[];
}

/**
 * 受講生テーブル表示コンポーネント
 * @description 受講生の一覧をテーブル形式で表示し、ページネーション機能を提供
 */
export const StudentsTable: React.FC<Props> = ({ students }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(students.filter((student) => student.favorite).map((student) => student.id)),
  );
  const [sortField, setSortField] = useState<SortableField>("stuckTasks");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // 1ページあたりの表示件数
  const itemsPerPage = 10;

  /**
   * お気に入り状態を切り替える
   * @param studentId - 受講生ID
   */
  const toggleFavorite = (studentId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(studentId)) {
        newFavorites.delete(studentId);
      } else {
        newFavorites.add(studentId);
      }
      return newFavorites;
    });
  };

  /**
   * ソート処理
   * @param field - ソート対象のフィールド
   */
  const handleSort = (field: SortableField) => {
    if (sortField === field) {
      // 同じフィールドの場合は方向を切り替え
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // 異なるフィールドの場合は新しいフィールドでデフォルト方向（全て数値なので降順）
      setSortField(field);
      setSortDirection("desc");
    }
    // ソート変更時はページを1に戻す
    setCurrentPage(1);
  };

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
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /**
   * ページ変更ハンドラー
   * @param page - 移動先のページ番号
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* 受講生リスト (テーブル表示に固定) */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>受講生</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${student.id}`}
                        />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
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
                      <span className="text-sm">{student.slackId}</span>
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
      <StudentsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
