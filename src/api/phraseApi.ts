import { axiosFetchServer } from './axiosFetchServer';

export const phraseApi = {
  create: (title: string) =>
    axiosFetchServer.post('phrases', {
      title: title,
    }),
  getAll: () => axiosFetchServer.get('/phrases'),
  getOne: (title: string) =>
    axiosFetchServer.post('/phrases/check', { title: title }),
  update: (
    id: string,
    params: {
      title: String;
    }
  ) => axiosFetchServer.put(`phrases/${id}`, params),
  delete: (id: string) => axiosFetchServer.delete(`phrases/${id}`),
};
