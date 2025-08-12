"use client";

import { useState, useMemo } from "react";

import { PageTitle } from "@/app/_components/PageTitle";
import { mockStudents } from "./_data/mockStudents";
import { StudentsSearchFilter } from "./_components/StudentsSearchFilter";
import { StudentsTable } from "./_components/StudentsTable";

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
 * 受講生一覧ページ
 * @description 学習進捗と受講生情報を管理するページ
 */
const StudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chapterFilter, setChapterFilter] = useState("all");

  /**
   * 検索・フィルター変更ハンドラー
   * @param searchValue - 検索語
   * @param chapterValue - 章フィルター
   */
  const handleFilterChange = (searchValue: string, chapterValue: string) => {
    setSearchTerm(searchValue);
    setChapterFilter(chapterValue);
  };

  /**
   * フィルタリングとソート
   * @description 検索語と章フィルターに基づいて受講生をフィルタリング
   */
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.slackId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesChapter =
        chapterFilter === "all" || student.currentChapter === parseInt(chapterFilter);

      return matchesSearch && matchesChapter;
    });
  }, [searchTerm, chapterFilter]);

  return (
    <div className="container mx-auto space-y-6 p-6 py-20">
      <PageTitle>受講生一覧</PageTitle>

      {/* 検索・フィルター */}
      <StudentsSearchFilter onFilterChange={handleFilterChange} />

      {/* 受講生リスト */}
      <StudentsTable students={filteredStudents} />
    </div>
  );
};

export default StudentsPage;
