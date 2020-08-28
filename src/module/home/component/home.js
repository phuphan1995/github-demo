import React, { useState, useEffect } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import homeDispatcher from '../action/home';
import { useSelector } from 'react-redux';
import { CssBaseline, TableHead, TableRow, TableCell } from '@material-ui/core';
import TableEnhanced from './TableEnhanced';
import Progress from 'react-progress-2';
import CustomAppbar from './CustomAppbar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& .loader-60devs': {
      height: '0.2rem',
      width: '100%',
    },
    '& .loader-60devs-progress': {
      height: '0.2rem',
      width: '100%',
      backgroundColor: '#ff6f00',
    },
  },
  paperContainer: {
    position: 'relative',
    width: '100%',
    marginTop: 200,
    marginLeft: '10%',
    marginRight: 20,
    marginBottom: 20,
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    margin: theme.spacing(3, 0, 3, 0),
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 2, 1, 1),
    paddingLeft: `calc(${theme.spacing(2)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  fab: {
    marginLeft: `-8px`,
  },
}));

const Home = () => {
  const classes = useStyles();
  const { listRepos, listOrgs, paging } = useSelector((state) => state.home);
  const [tabIdx, setTabIdx] = useState(0);
  const [username, setUsername] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  const onSearch = (e) => {
    e.preventDefault();
    let data = e.target;
    setUsername(data?.search?.value);
  };

  const onChangePagination = (pagingData) => {
    homeDispatcher.changePagination(pagingData);
  };

  useEffect(() => {
    username && homeDispatcher.getData(username, paging, !!tabIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paging, username]);

  useEffect(() => {
    onChangePagination({
      ...paging,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIdx]);

  const ReposHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell>Id</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Full Name</TableCell>
      </TableRow>
    </TableHead>
  );

  const OrgsHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell>Id</TableCell>
        <TableCell>Url</TableCell>
        <TableCell>Description</TableCell>
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

  const renderOrgsRow = (row) => (
    <>
      <TableCell>{row.id}</TableCell>
      <TableCell>{row.url}</TableCell>
      <TableCell>{row.description}</TableCell>
    </>
  );

  return (
    <div className={classes.root}>
      <Progress.Component />
      <CssBaseline />
      <CustomAppbar
        onSearch={onSearch}
        handleTabChange={handleTabChange}
        tabIdx={tabIdx}
      />
      {tabIdx ? (
        <TableEnhanced
          header={OrgsHeader}
          data={listOrgs}
          paging={paging}
          className={classes.paperContainer}
          onChangePagination={onChangePagination}
          renderRow={renderOrgsRow}
        />
      ) : (
        <TableEnhanced
          header={ReposHeader}
          data={listRepos}
          paging={paging}
          className={classes.paperContainer}
          onChangePagination={onChangePagination}
          renderRow={renderReposRow}
        />
      )}
    </div>
  );
};

export default Home;
