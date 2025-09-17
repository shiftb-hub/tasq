"use client";

import { useMemo, useState } from "react";
import { PageTitle } from "@/app/_components/PageTitle";
import { PageSubTitle } from "@/app/_components/PageSubTitle";
import { StudentsSearchFilter } from "./StudentsSearchFilter";
import { StudentsTable } from "./StudentsTable";
import { ToggleFavoriteResult, StudentListItem } from "@/app/_types/Student";

type Props = {
  /** 表示対象の受講生一覧（サーバーで集計済み） */
  students: StudentListItem[];
  /** お気に入り切り替えの Server Action */
  onToggleFavorite?: (studentId: string) => Promise<ToggleFavoriteResult>;
};

/**
 * 受講生ページ（クライアント側ラッパー）
 * - 検索・章フィルターなどのUI状態を管理
 * - テーブル表示へ絞り込んだデータを渡す
 */
export const StudentsPageClient = ({ students, onToggleFavorite }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chapterFilter, setChapterFilter] = useState("all");

  /** 検索語・章フィルターの変更を反映 */
  const handleFilterChange = (searchValue: string, chapterValue: string) => {
    setSearchTerm(searchValue);
    setChapterFilter(chapterValue);
  };

  /** 検索語と章フィルターに基づく受講生の絞り込み */
  const filteredStudents = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(lower) ||
        (student.slackId ?? "").toLowerCase().includes(lower);

      const matchesChapter =
        chapterFilter === "all" || student.currentChapter === parseInt(chapterFilter);

      return matchesSearch && matchesChapter;
    });
  }, [students, searchTerm, chapterFilter]);

  return (
    <div className="container mx-auto space-y-6 p-6 py-20">
      <PageTitle className="mb-2">受講生一覧</PageTitle>
      <PageSubTitle>学習者の進捗とタスク状況を管理</PageSubTitle>

      <StudentsSearchFilter onFilterChange={handleFilterChange} />
      <StudentsTable students={filteredStudents} onToggleFavorite={onToggleFavorite} />
    </div>
  );
};
