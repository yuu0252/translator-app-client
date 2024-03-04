import { axiosFetchServer } from "./axiosFetchServer";

export const categoryApi = {
  create: (title: string) =>
    axiosFetchServer.post("categories", {
      title: title,
    }),
  getAll: () => axiosFetchServer.get("/categories"),
  update: (
    id: string,
    params: {
      title: String;
    }
  ) => axiosFetchServer.put(`categories/${id}`, params),
  delete: (id: string) => axiosFetchServer.delete(`categories/${id}`),
};
