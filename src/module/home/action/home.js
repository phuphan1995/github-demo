import { synthesize } from 'redux-dispatcher';
import { SUCCESS_CODE } from '../../../helper/Api';

const repos_url = 'repos';
const organizations_url = 'orgs';

const mapDispatchToAC = {
  getDataSuccess: (data, isOrgs) => ({ data, isOrgs }),
  changePagination: (data) => ({ data }),
  getData: (username, paging, isOrgs) => async ({ Api, getState }) => {
    let pagingData = paging || getState().home.paging;
    let { result } = await Api.get(
      `${username}/${isOrgs ? organizations_url : repos_url}`,
      {
        page: pagingData.page,
        per_page: pagingData.size,
      }
    );
    homeDispatcher.getDataSuccess(result || [], isOrgs);
  },
};

const homeDispatcher = synthesize('home', mapDispatchToAC);
export default homeDispatcher;
