import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  setFilters: ['filter'],
  setName: ['name'],
  setWorkshop: ["workshop"],
  setMenu: ["menu"],
  setDefaultkey: ["defaultkey"]
});
