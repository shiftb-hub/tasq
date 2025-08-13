"use client";

import { useState } from "react";
import { Input } from "@/app/_components/ui/input";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { FiSearch } from "react-icons/fi";
import { ChapterTitles } from "@/app/_constants/ChapterTitles";

interface Props {
  onFilterChange: (searchTerm: string, chapterFilter: string) => void;
}

/**
 * 受講生検索・フィルターコンポーネント
 * @description 受講生一覧の検索とフィルタリング機能を提供
 */
export const StudentsSearchFilter: React.FC<Props> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chapterFilter, setChapterFilter] = useState("all");

  /**
   * 検索語変更ハンドラー
   * @param value - 新しい検索語
   */
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange(value, chapterFilter);
  };

  /**
   * 章フィルター変更ハンドラー
   * @param value - 新しい章フィルター
   */
  const handleChapterFilterChange = (value: string) => {
    setChapterFilter(value);
    onFilterChange(searchTerm, value);
  };

  return (
    <Card className="py-2">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <FiSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="名前、またはSlackIDで検索..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={chapterFilter} onValueChange={handleChapterFilterChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="取り組み中の章" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全ての章</SelectItem>
              {Object.entries(ChapterTitles).map(([chapterNum, title]) => (
                <SelectItem key={chapterNum} value={chapterNum}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
