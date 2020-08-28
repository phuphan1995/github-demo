import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
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
const CustomAppbar = ({ onSearch, handleTabChange, tabIdx }) => {
  const classes = useStyles();
  return (
    <AppBar position="fixed">
      <form onSubmit={onSearch}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Github Demo
          </Typography>
          <div className={classes.search}>
            <InputBase
              name="search"
              id="search"
              placeholder="Input username"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <Fab className={classes.fab} type="submit" data-testid="submit-btn">
            <SearchIcon />
          </Fab>
        </Toolbar>
        <div style={{ backgroundColor: 'white' }}>
          <Tabs
            value={tabIdx}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
            style={{ marginTop: 50, marginLeft: '10%' }}
          >
            <Tab label="Repositories" />
            <Tab label="Organizations" />
          </Tabs>
        </div>
      </form>
    </AppBar>
  );
};

export default CustomAppbar;
