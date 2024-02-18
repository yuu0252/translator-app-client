import { axiosFetchServer } from './axiosFetchServer';

export const phraseApi = {
  create: (title: string) =>
    axiosFetchServer.post('phrases', {
      title: title,
    }),
  getAll: () => axiosFetchServer.get('/phrases'),
};
