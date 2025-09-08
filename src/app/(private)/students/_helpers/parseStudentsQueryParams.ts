export type SortableField = "currentChapter" | "stuckTasks" | "stuckTasksTrend" | "totalTasks";
export type SortDirection = "asc" | "desc";

/**
 * 受講生テーブルのデフォルト値
 */
export const STUDENTS_TABLE_DEFAULTS = {
  PAGE: 1,
  SORT_FIELD: "stuckTasks" as SortableField,
  SORT_DIRECTION: "desc" as SortDirection,
  ITEMS_PER_PAGE: 5,
} as const;

/**
 * ソート可能なフィールドのリスト
 */
export const SORTABLE_FIELDS: readonly SortableField[] = [
  "currentChapter",
  "stuckTasks",
  "stuckTasksTrend",
  "totalTasks",
] as const;

/**
 * URLクエリパラメータの解析結果
 */
export interface StudentsQueryParams {
  page: number;
  sortField: SortableField;
  sortDirection: SortDirection;
}

/**
 * URLSearchParamsから受講生テーブルのクエリパラメータを解析
 * @param searchParams - URLSearchParamsオブジェクト
 * @returns 解析済みのクエリパラメータ
 */
export const parseStudentsQueryParams = (searchParams: URLSearchParams): StudentsQueryParams => {
  // ページ番号の解析
  const pRaw = Number.parseInt(
    searchParams.get("page") ?? String(STUDENTS_TABLE_DEFAULTS.PAGE),
    10,
  );
  const page = Number.isFinite(pRaw) && pRaw > 0 ? pRaw : STUDENTS_TABLE_DEFAULTS.PAGE;

  // ソートフィールドの解析
  const s = (searchParams.get("sort") ?? STUDENTS_TABLE_DEFAULTS.SORT_FIELD) as string;
  const sortField: SortableField = (SORTABLE_FIELDS as readonly string[]).includes(s)
    ? (s as SortableField)
    : STUDENTS_TABLE_DEFAULTS.SORT_FIELD;

  // ソート方向の解析
  const sortDirection: SortDirection =
    (searchParams.get("dir") ?? STUDENTS_TABLE_DEFAULTS.SORT_DIRECTION) === "asc" ? "asc" : "desc";

  return { page, sortField, sortDirection };
};
