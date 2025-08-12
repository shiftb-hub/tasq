"use client";

import { useState } from "react";
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
import { FiBookOpen, FiStar, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { TaskTrend } from "./TaskTrend";
import { Pagination } from "./Pagination";

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

  const itemsPerPage = 5;

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
   * ページネーション
   * @description フィルタリングされた受講生をページごとに分割
   */
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const paginatedStudents = students.slice(
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
                <TableHead>取組中の章</TableHead>
                <TableHead>困っているタスク</TableHead>
                <TableHead>お困りタスク動向</TableHead>
                <TableHead>全タスク数</TableHead>
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
                        <p className="font-medium">{student.name}</p>
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
