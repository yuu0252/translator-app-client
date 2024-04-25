import { axiosFetchServer } from "./axiosFetchServer";

export const phraseApi = {
  // 指定されたカテゴリに新規フレーズを追加
  create: (category: string, params: { title: string }) =>
    axiosFetchServer.post(`/categories/${category}/phrases`, params),
  // 指定されたカテゴリのフレーズをすべて取得
  getAll: (category: string) =>
    axiosFetchServer.get(`/categories/${category}/phrases`),
  // フレーズがいずれかのカテゴリ内に存在するかテェック
  checkExist: (title: string) =>
    axiosFetchServer.post("/categories/phrases/check", { title: title }),
  // 指定されたフレーズを編集
  update: (
    categoryId: string,
    phraseId: string,
    params: {
      title: String;
    }
  ) =>
    axiosFetchServer.put(
      `categories/${categoryId}/phrases/${phraseId}`,
      params
    ),
  // 指定されたフレーズを削除
  delete: (categoryId: string, phraseId: string) =>
    axiosFetchServer.delete(`categories/${categoryId}/phrases/${phraseId}`),
};
