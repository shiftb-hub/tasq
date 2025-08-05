export const api = {
  get: async <ResponseType>(endpoint: string) => {
    try {
      const res = await fetch(endpoint, {
        credentials: "include",
        cache: "no-store", // 開発中はキャッシュを無効化して常に最新データを取得
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error("データの取得に失敗しました。", { cause: errorData });
      }
      const data: ResponseType = await res.json();
      return data;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  },

  post: async <RequestType, ResponseType>(
    endpoint: string,
    payload: RequestType,
  ) => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      if (!res.ok)
        throw new Error(responseData.message || "登録に失敗しました。");
      return responseData as ResponseType;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  },

  put: async <RequestType, ResponseType>(
    endpoint: string,
    payload: RequestType,
  ) => {
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("更新に失敗しました。");
      const data: ResponseType = await res.json();
      return data;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  },

  del: async <ResponseType>(endpoint: string) => {
    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("削除に失敗しました。");
      const data: ResponseType = await res.json();
      return data;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  },
};
