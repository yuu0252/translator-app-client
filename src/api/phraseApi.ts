import { axiosFetchServer } from "./axiosFetchServer";

export const phraseApi = {
  create: (category: string, params: { title: string }) =>
    axiosFetchServer.post(`/categories/${category}/phrases`, params),
  getAll: (category: string) =>
    axiosFetchServer.get(`/categories/${category}/phrases`),
  getOne: (title: string) =>
    axiosFetchServer.post("/phrases/check", { title: title }),
  update: (
    id: string,
    params: {
      title: String;
    }
  ) => axiosFetchServer.put(`phrases/${id}`, params),
  delete: (categoryId: string, phraseId: string) =>
    axiosFetchServer.delete(`categories/${categoryId}/phrases/${phraseId}`),
};
