import React from 'react';
import {
  render,
  fireEvent,
  screen,
  getByText,
  waitForElement,
} from '@testing-library/react';
import Home from '../component/home';
import { Provider } from 'react-redux';
import configureStore from '../../../redux/store';
import renderer from 'react-test-renderer';
import { createStore } from 'redux';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CustomAppbar from '../component/CustomAppbar';
import TableEnhanced from '../component/TableEnhanced';
import {
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from '@material-ui/core';

Enzyme.configure({ adapter: new Adapter() });

const ReduxProvider = ({ children, reduxStore }) => (
  <Provider store={reduxStore}>{children}</Provider>
);

const REPOS_DATA = [
  {
    id: 259872533,
    node_id: 'MDEwOlJlcG9zaXRvcnkyNTk4NzI1MzM=',
    name: 'test',
    full_name: 'honghoangsts/test',
    private: false,
    owner: {
      login: 'honghoangsts',
      id: 63329049,
      node_id: 'MDQ6VXNlcjYzMzI5MDQ5',
      avatar_url: 'https://avatars0.githubusercontent.com/u/63329049?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/honghoangsts',
      html_url: 'https://github.com/honghoangsts',
      followers_url: 'https://api.github.com/users/honghoangsts/followers',
      following_url:
        'https://api.github.com/users/honghoangsts/following{/other_user}',
      gists_url: 'https://api.github.com/users/honghoangsts/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/honghoangsts/starred{/owner}{/repo}',
      subscriptions_url:
        'https://api.github.com/users/honghoangsts/subscriptions',
      organizations_url: 'https://api.github.com/users/honghoangsts/orgs',
      repos_url: 'https://api.github.com/users/honghoangsts/repos',
      events_url: 'https://api.github.com/users/honghoangsts/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/honghoangsts/received_events',
      type: 'User',
      site_admin: false,
    },
    html_url: 'https://github.com/honghoangsts/test',
    description: null,
    fork: false,
    url: 'https://api.github.com/repos/honghoangsts/test',
    forks_url: 'https://api.github.com/repos/honghoangsts/test/forks',
    keys_url: 'https://api.github.com/repos/honghoangsts/test/keys{/key_id}',
    collaborators_url:
      'https://api.github.com/repos/honghoangsts/test/collaborators{/collaborator}',
    teams_url: 'https://api.github.com/repos/honghoangsts/test/teams',
    hooks_url: 'https://api.github.com/repos/honghoangsts/test/hooks',
    issue_events_url:
      'https://api.github.com/repos/honghoangsts/test/issues/events{/number}',
    events_url: 'https://api.github.com/repos/honghoangsts/test/events',
    assignees_url:
      'https://api.github.com/repos/honghoangsts/test/assignees{/user}',
    branches_url:
      'https://api.github.com/repos/honghoangsts/test/branches{/branch}',
    tags_url: 'https://api.github.com/repos/honghoangsts/test/tags',
    blobs_url: 'https://api.github.com/repos/honghoangsts/test/git/blobs{/sha}',
    git_tags_url:
      'https://api.github.com/repos/honghoangsts/test/git/tags{/sha}',
    git_refs_url:
      'https://api.github.com/repos/honghoangsts/test/git/refs{/sha}',
    trees_url: 'https://api.github.com/repos/honghoangsts/test/git/trees{/sha}',
    statuses_url:
      'https://api.github.com/repos/honghoangsts/test/statuses/{sha}',
    languages_url: 'https://api.github.com/repos/honghoangsts/test/languages',
    stargazers_url: 'https://api.github.com/repos/honghoangsts/test/stargazers',
    contributors_url:
      'https://api.github.com/repos/honghoangsts/test/contributors',
    subscribers_url:
      'https://api.github.com/repos/honghoangsts/test/subscribers',
    subscription_url:
      'https://api.github.com/repos/honghoangsts/test/subscription',
    commits_url: 'https://api.github.com/repos/honghoangsts/test/commits{/sha}',
    git_commits_url:
      'https://api.github.com/repos/honghoangsts/test/git/commits{/sha}',
    comments_url:
      'https://api.github.com/repos/honghoangsts/test/comments{/number}',
    issue_comment_url:
      'https://api.github.com/repos/honghoangsts/test/issues/comments{/number}',
    contents_url:
      'https://api.github.com/repos/honghoangsts/test/contents/{+path}',
    compare_url:
      'https://api.github.com/repos/honghoangsts/test/compare/{base}...{head}',
    merges_url: 'https://api.github.com/repos/honghoangsts/test/merges',
    archive_url:
      'https://api.github.com/repos/honghoangsts/test/{archive_format}{/ref}',
    downloads_url: 'https://api.github.com/repos/honghoangsts/test/downloads',
    issues_url:
      'https://api.github.com/repos/honghoangsts/test/issues{/number}',
    pulls_url: 'https://api.github.com/repos/honghoangsts/test/pulls{/number}',
    milestones_url:
      'https://api.github.com/repos/honghoangsts/test/milestones{/number}',
    notifications_url:
      'https://api.github.com/repos/honghoangsts/test/notifications{?since,all,participating}',
    labels_url: 'https://api.github.com/repos/honghoangsts/test/labels{/name}',
    releases_url:
      'https://api.github.com/repos/honghoangsts/test/releases{/id}',
    deployments_url:
      'https://api.github.com/repos/honghoangsts/test/deployments',
    created_at: '2020-04-29T08:47:03Z',
    updated_at: '2020-04-29T08:47:03Z',
    pushed_at: '2020-04-29T08:47:04Z',
    git_url: 'git://github.com/honghoangsts/test.git',
    ssh_url: 'git@github.com:honghoangsts/test.git',
    clone_url: 'https://github.com/honghoangsts/test.git',
    svn_url: 'https://github.com/honghoangsts/test',
    homepage: null,
    size: 0,
    stargazers_count: 0,
    watchers_count: 0,
    language: null,
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: 0,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: null,
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: 'master',
  },
  {
    id: 259872533,
    node_id: 'MDEwOlJlcG9zaXRvcnkyNTk4NzI1MzM=',
    name: 'test',
    full_name: 'honghoangsts/test',
    private: false,
    owner: {
      login: 'honghoangsts',
      id: 63329049,
      node_id: 'MDQ6VXNlcjYzMzI5MDQ5',
      avatar_url: 'https://avatars0.githubusercontent.com/u/63329049?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/honghoangsts',
      html_url: 'https://github.com/honghoangsts',
      followers_url: 'https://api.github.com/users/honghoangsts/followers',
      following_url:
        'https://api.github.com/users/honghoangsts/following{/other_user}',
      gists_url: 'https://api.github.com/users/honghoangsts/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/honghoangsts/starred{/owner}{/repo}',
      subscriptions_url:
        'https://api.github.com/users/honghoangsts/subscriptions',
      organizations_url: 'https://api.github.com/users/honghoangsts/orgs',
      repos_url: 'https://api.github.com/users/honghoangsts/repos',
      events_url: 'https://api.github.com/users/honghoangsts/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/honghoangsts/received_events',
      type: 'User',
      site_admin: false,
    },
    html_url: 'https://github.com/honghoangsts/test',
    description: null,
    fork: false,
    url: 'https://api.github.com/repos/honghoangsts/test',
    forks_url: 'https://api.github.com/repos/honghoangsts/test/forks',
    keys_url: 'https://api.github.com/repos/honghoangsts/test/keys{/key_id}',
    collaborators_url:
      'https://api.github.com/repos/honghoangsts/test/collaborators{/collaborator}',
    teams_url: 'https://api.github.com/repos/honghoangsts/test/teams',
    hooks_url: 'https://api.github.com/repos/honghoangsts/test/hooks',
    issue_events_url:
      'https://api.github.com/repos/honghoangsts/test/issues/events{/number}',
    events_url: 'https://api.github.com/repos/honghoangsts/test/events',
    assignees_url:
      'https://api.github.com/repos/honghoangsts/test/assignees{/user}',
    branches_url:
      'https://api.github.com/repos/honghoangsts/test/branches{/branch}',
    tags_url: 'https://api.github.com/repos/honghoangsts/test/tags',
    blobs_url: 'https://api.github.com/repos/honghoangsts/test/git/blobs{/sha}',
    git_tags_url:
      'https://api.github.com/repos/honghoangsts/test/git/tags{/sha}',
    git_refs_url:
      'https://api.github.com/repos/honghoangsts/test/git/refs{/sha}',
    trees_url: 'https://api.github.com/repos/honghoangsts/test/git/trees{/sha}',
    statuses_url:
      'https://api.github.com/repos/honghoangsts/test/statuses/{sha}',
    languages_url: 'https://api.github.com/repos/honghoangsts/test/languages',
    stargazers_url: 'https://api.github.com/repos/honghoangsts/test/stargazers',
    contributors_url:
      'https://api.github.com/repos/honghoangsts/test/contributors',
    subscribers_url:
      'https://api.github.com/repos/honghoangsts/test/subscribers',
    subscription_url:
      'https://api.github.com/repos/honghoangsts/test/subscription',
    commits_url: 'https://api.github.com/repos/honghoangsts/test/commits{/sha}',
    git_commits_url:
      'https://api.github.com/repos/honghoangsts/test/git/commits{/sha}',
    comments_url:
      'https://api.github.com/repos/honghoangsts/test/comments{/number}',
    issue_comment_url:
      'https://api.github.com/repos/honghoangsts/test/issues/comments{/number}',
    contents_url:
      'https://api.github.com/repos/honghoangsts/test/contents/{+path}',
    compare_url:
      'https://api.github.com/repos/honghoangsts/test/compare/{base}...{head}',
    merges_url: 'https://api.github.com/repos/honghoangsts/test/merges',
    archive_url:
      'https://api.github.com/repos/honghoangsts/test/{archive_format}{/ref}',
    downloads_url: 'https://api.github.com/repos/honghoangsts/test/downloads',
    issues_url:
      'https://api.github.com/repos/honghoangsts/test/issues{/number}',
    pulls_url: 'https://api.github.com/repos/honghoangsts/test/pulls{/number}',
    milestones_url:
      'https://api.github.com/repos/honghoangsts/test/milestones{/number}',
    notifications_url:
      'https://api.github.com/repos/honghoangsts/test/notifications{?since,all,participating}',
    labels_url: 'https://api.github.com/repos/honghoangsts/test/labels{/name}',
    releases_url:
      'https://api.github.com/repos/honghoangsts/test/releases{/id}',
    deployments_url:
      'https://api.github.com/repos/honghoangsts/test/deployments',
    created_at: '2020-04-29T08:47:03Z',
    updated_at: '2020-04-29T08:47:03Z',
    pushed_at: '2020-04-29T08:47:04Z',
    git_url: 'git://github.com/honghoangsts/test.git',
    ssh_url: 'git@github.com:honghoangsts/test.git',
    clone_url: 'https://github.com/honghoangsts/test.git',
    svn_url: 'https://github.com/honghoangsts/test',
    homepage: null,
    size: 0,
    stargazers_count: 0,
    watchers_count: 0,
    language: null,
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: 0,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: null,
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: 'master',
  },
];

const ORGS_DATA = [
  {
    id: 259872533,
    url: 'test_url',
    description: 'test_description',
  },
  {
    id: 259872533,
    url: 'test_url',
    description: 'test_description',
  },
];
describe('App', () => {
  test('render title', () => {
    const configure = configureStore();
    const wrapper = ({ children }) => (
      <ReduxProvider reduxStore={configure.store}>{children}</ReduxProvider>
    );
    render(<Home />, { wrapper });
    expect(screen.getByText('Github Demo')).toBeInTheDocument();
  });
  test('on search have been called when user click search button', () => {
    const onSearch = jest.fn();
    render(<CustomAppbar onSearch={onSearch} />);
    const usernameInput = screen.getByLabelText(/search/i);
    fireEvent.change(usernameInput, { target: { value: 'suhailvs' } });
    fireEvent.click(screen.getByTestId(/submit-btn/i));
    expect(onSearch).toHaveBeenCalled();
  });

  test('on change table pagination', async () => {
    const onChangePagination = jest.fn();
    render(<TableEnhanced onChangePagination={onChangePagination} />);
    fireEvent.click(screen.getByTestId(/previous-page/i));
    fireEvent.click(screen.getByTestId(/next-page/i));
    expect(onChangePagination).toHaveBeenCalledTimes(2);
  });
  test('render repos data', async () => {
    const cols = ['Id', 'Name', 'Full Name'];
    const ReposHeader = () => (
      <TableHead>
        <TableRow>
          {cols.map((i) => (
            <TableCell>{i}</TableCell>
          ))}
        </TableRow>
      </TableHead>
    );

    const renderReposRow = (row) => (
      <>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.full_name}</TableCell>
      </>
    );
    const listRepos = REPOS_DATA;
    const wrapper = mount(
      <TableEnhanced
        header={ReposHeader}
        data={listRepos}
        renderRow={renderReposRow}
      />
    );
    const table = wrapper.find('table');
    const thead = table.find('thead');
    const headers = thead.find('th');

    expect(headers).toHaveLength(cols.length);
    headers.forEach((th, idx) => {
      expect(th.text()).toEqual(cols[idx]);
    });
    const tbody = table.find('tbody');
    const rows = tbody.find('tr');
    expect(rows).toHaveLength(listRepos.length);
    rows.forEach((tr, rowIndex) => {
      const cells = tr.find('td');
      expect(+cells.at(0).text()).toEqual(listRepos[rowIndex].id);
      expect(cells.at(1).text()).toEqual(listRepos[rowIndex].name);
      expect(cells.at(2).text()).toEqual(listRepos[rowIndex].full_name);
    });
  });

  test('render orgs data', async () => {
    const cols = ['Id', 'Url', 'Description'];
    const OrgsHeader = () => (
      <TableHead>
        <TableRow>
          {cols.map((i) => (
            <TableCell>{i}</TableCell>
          ))}
        </TableRow>
      </TableHead>
    );

    const renderOrgsRow = (row) => (
      <>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.url}</TableCell>
        <TableCell>{row.description}</TableCell>
      </>
    );
    const listOrgs = ORGS_DATA;
    const wrapper = mount(
      <TableEnhanced
        header={OrgsHeader}
        data={listOrgs}
        renderRow={renderOrgsRow}
      />
    );
    const table = wrapper.find('table');
    const thead = table.find('thead');
    const headers = thead.find('th');

    expect(headers).toHaveLength(cols.length);
    headers.forEach((th, idx) => {
      expect(th.text()).toEqual(cols[idx]);
    });
    const tbody = table.find('tbody');
    const rows = tbody.find('tr');
    expect(rows).toHaveLength(listOrgs.length);
    rows.forEach((tr, rowIndex) => {
      const cells = tr.find('td');
      expect(+cells.at(0).text()).toEqual(listOrgs[rowIndex].id);
      expect(cells.at(1).text()).toEqual(listOrgs[rowIndex].url);
      expect(cells.at(2).text()).toEqual(listOrgs[rowIndex].description);
    });
  });
});
