"use client";

import { useState, useMemo } from "react";
import { PageTitle } from "@/app/_components/PageTitle";
import { PageSubTitle } from "@/app/_components/PageSubTitle";
import { mockStudents } from "./_data/mockStudents";
import { StudentsSearchFilter } from "./_components/StudentsSearchFilter";
import { StudentsTable } from "./_components/StudentsTable";

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
      <div className="flex flex-col items-start text-left">
        <PageTitle className="mb-2">受講生一覧</PageTitle>
        <PageSubTitle>学習進捗と受講生情報を管理</PageSubTitle>
      </div>

      {/* 検索・フィルター */}
      <StudentsSearchFilter onFilterChange={handleFilterChange} />

      {/* 受講生リスト */}
      <StudentsTable students={filteredStudents} />
    </div>
  );
};

export default StudentsPage;
