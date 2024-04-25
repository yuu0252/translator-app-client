import { axiosFetchServer } from "./axiosFetchServer";

export const categoryApi = {
  // 新規カテゴリ作成
  create: (title: string) =>
    axiosFetchServer.post("categories", {
      title: title,
    }),
  // すべてのカテゴリを取得
  getAll: () => axiosFetchServer.get("/categories"),
  // 指定されたカテゴリを編集
  update: (
    id: string,
    params: {
      title: String;
    }
  ) => axiosFetchServer.put(`categories/${id}`, params),
  // 指定されたカテゴリを削除
  delete: (id: string) => axiosFetchServer.delete(`categories/${id}`),
};
