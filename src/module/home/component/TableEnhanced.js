import React from 'react';
import {
  Table,
  Paper,
  TableContainer as MUTableContainer,
  TableBody,
  Typography,
  TableRow,
  IconButton,
  Select,
  MenuItem,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';

const useStyles = makeStyles({
  contained: {
    boxShadow: 'none',
  },
  head: {
    fontWeight: 600,
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

const TableEnhanced = ({
  header: Header,
  renderRow,
  paging = {},
  data = [],
  onChangePagination,
  ...props
}) => {
  const classes = useStyles();

  const TablePaginationActions = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const { data, rowsPerPageOptions, page, rowsPerPage } = props;

    const handleBackButtonClick = () => {
      onChangePagination({
        ...paging,
        page: page - 1,
      });
    };

    const handleNextButtonClick = () => {
      onChangePagination({
        ...paging,
        page: page + 1,
      });
    };

    return (
      <div className={classes.root}>
        <Typography style={{ marginRight: 10 }}>Rows per page:</Typography>
        <Select
          disableUnderline
          value={rowsPerPage}
          onChange={(e) =>
            onChangePagination({
              ...paging,
              page: 1,
              size: e.target.value,
            })
          }
          data-testid="page-size-select"
        >
          {rowsPerPageOptions.map((i) => (
            <MenuItem value={i} key={i}>
              {i}
            </MenuItem>
          ))}
        </Select>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page <= 1}
          aria-label="previous page"
          data-testid="previous-page"
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={data.length < rowsPerPage}
          aria-label="next page"
          data-testid="next-page"
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
      </div>
    );
  };

  return (
    <MUTableContainer component={Paper} {...props}>
      <Table data-testid="table">
        {Header && <Header />}
        <TableBody className='test-table-body'>
          {(data || []).map((d, i) => (
            <TableRow
              key={d.id}
              hover
              classes={{
                head: classes.head,
              }}
            >
              {renderRow(d, i)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePaginationActions
        rowsPerPageOptions={[10, 50, 100]}
        rowsPerPage={paging.size}
        page={paging.page}
        data={data}
      />
    </MUTableContainer>
  );
};

export default TableEnhanced;
