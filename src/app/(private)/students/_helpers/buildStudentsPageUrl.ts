const DEFAULTS = {
  page: 1,
  sort: "stuckTasks",
  dir: "desc",
  per: 5,
} as const;

export const buildStudentsPageUrl = (
  page: number,
  sortField: string,
  sortDir: string,
  perPage: number,
) => {
  const params = new URLSearchParams();
  if (page !== DEFAULTS.page) params.set("page", String(page));
  if (sortField && sortField !== DEFAULTS.sort) params.set("sort", sortField);
  if (sortDir && sortDir !== DEFAULTS.dir) params.set("dir", sortDir);
  if (perPage !== DEFAULTS.per) params.set("per", String(perPage));
  const query = params.toString();
  return `/students${query ? `?${query}` : ""}`;
};

