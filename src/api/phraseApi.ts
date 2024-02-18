import { axiosFetchServer } from './axiosFetchServer';

export const phraseApi = {
  create: (title: string) =>
    axiosFetchServer.post('phrases', {
      title: title,
    }),
  getAll: () => axiosFetchServer.get('/phrases'),
  update: (
    id: string,
    params: {
      title: String;
    }
  ) => axiosFetchServer.put(`phrases/${id}`, params),
  delete: (id: string) => axiosFetchServer.delete(`phrases/${id}`),
};
