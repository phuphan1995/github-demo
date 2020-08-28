import homeDispatcher from '../action/home';

const initialState = {
  listRepos: [],
  listOrgs: [],
  paging: {
    page: 1,
    size: 10,
  },
};

const homeReducer = homeDispatcher(initialState, {
  [homeDispatcher.getDataSuccess]: (state, payload) =>
    payload.isOrgs
      ? {
          listOrgs: payload.data,
        }
      : {
          listRepos: payload.data,
        },
  [homeDispatcher.changePagination]: (state, payload) => ({
    paging: payload.data,
  }),
});

export default homeReducer;
