"use client";

import { useState, useMemo } from "react";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Badge } from "@/app/_components/ui/badge";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiBookOpen,
  FiStar,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { PageTitle } from "@/app/_components/PageTitle";
import { mockStudents } from "./_data/mockStudents";

// 既存のコード（コメントアウト）
// import prisma from "@/app/_libs/prisma";
// import { UserService } from "@/app/_services/userService";
// import { Role } from "@prisma/client";

// interface Props {
//   children: React.ReactNode;
// }

// const StudentsPage: React.FC<Props> = async (props) => {
//   const userService = new UserService(prisma);
//   const allUsers = await userService.getAll({});
//   console.log("allUsers", allUsers);
//   // const allStudents = await userService.getAll({
//   //   where: { role: "STUDENT" },
//   // });
//   // console.log("allStudents", allStudents);

//   return (
//     <>
//       <h1>Students Page</h1>
//       {allUsers.map((user) => (
//         <div key={user.id}>{user.name}</div>
//       ))}
//     </>
//   );
// };

/**
 * お困りタスク動向の表示用ヘルパー関数
 * @param trend - 変化量（正数=増加、負数=減少、0=変化なし）
 * @returns 表示用のオブジェクト
 */
const getTrendDisplay = (trend: number) => {
  if (trend === 0) {
    return {
      text: "0→",
      color: "text-gray-500",
    };
  }

  if (trend > 0) {
    return {
      text: `${trend}↑`,
      color: "text-red-600",
    };
  } else {
    return {
      text: `${Math.abs(trend)}↓`,
      color: "text-green-600",
    };
  }
};

/**
 * 受講生一覧ページ
 * @description 学習進捗と受講生情報を管理するページ
 * @returns {JSX.Element} 受講生一覧ページのコンポーネント
 */
export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(
      mockStudents
        .filter((student) => student.favorite)
        .map((student) => student.id),
    ),
  );

  /**
   * お気に入り状態を切り替える
   * @param {string} studentId - 受講生ID
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
   * フィルタリングとソート
   * @description 検索語と章フィルターに基づいて受講生をフィルタリング
   * @returns {Array} フィルタリングされた受講生リスト
   */
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesChapter =
        chapterFilter === "all" ||
        (chapterFilter === "beginner" && student.currentChapter <= 3) ||
        (chapterFilter === "intermediate" &&
          student.currentChapter > 3 &&
          student.currentChapter <= 8) ||
        (chapterFilter === "advanced" && student.currentChapter > 8);

      return matchesSearch && matchesChapter;
    });
  }, [searchTerm, chapterFilter]);

  /**
   * ページネーション
   * @description フィルタリングされた受講生をページごとに分割
   */
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="container mx-auto space-y-6 p-6 py-20">
      <PageTitle>受講生一覧</PageTitle>

      {/* 検索・フィルター */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={chapterFilter} onValueChange={setChapterFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="取り組み中の章" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全ての章</SelectItem>
                <SelectItem value="beginner">初級 (1-3章)</SelectItem>
                <SelectItem value="intermediate">中級 (4-8章)</SelectItem>
                <SelectItem value="advanced">上級 (9章以上)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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
                        <AvatarFallback>
                          {student.name.charAt(0)}
                        </AvatarFallback>
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
                      <span className="text-sm font-medium">
                        {student.currentChapter}章
                      </span>
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
                          <span className="text-muted-foreground text-sm">
                            0
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const trendDisplay = getTrendDisplay(
                          student.stuckTasksTrend,
                        );
                        return (
                          <span
                            className={`text-sm font-medium ${trendDisplay.color}`}
                          >
                            {trendDisplay.text}
                          </span>
                        );
                      })()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {student.totalTasks}
                      </span>
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
      {totalPages > 1 && (
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <FiChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-md bg-transparent px-4 py-2 font-bold"
            >
              {currentPage}
            </Button>
            {currentPage < totalPages && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                className="font-normal"
              >
                {currentPage + 1}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <FiChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
