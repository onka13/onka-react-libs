import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import zipcelx from 'zipcelx';
import get from 'lodash/get';
import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Table,
  TableBody,
  TableCell,
  SortDirection,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Checkbox,
  Paper,
} from '@material-ui/core';
import ExportIcon from '@material-ui/icons/ImportExport';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DetailIcon from '@material-ui/icons/RemoveRedEye';
import { PageConfig } from '../../data/lib/PageConfig';
import { ApiSearchRequest } from '../../data/api/ApiRequest';
import { UIManager } from '../services/UIManager';
import { ApiBusinessLogic } from '../services/ApiBusinessLogic';
import { allInputs } from '../../ui/panel/components/form/index';
import { FilterComponentProp } from '../../data/lib/FilterComponentProp';
import { GridComponentProp } from '../../data/lib/GridComponentProp';
import { GridRowExtraActionProp } from '../../data/lib/GridRowExtraActionProp';
import { GridBulkActionProp } from '../../data/lib/GridBulkActionProp';
import { LibService } from '../services/LibService';
import { PageStatus } from '../../data/lib/Types';
import { LocaleService } from '../services/LocaleService';
import { PageFilterField } from '../../data/lib/PageFilterField';
import { PageGridField } from '../../data/lib/PageGridFields';
import { TablePaginationActions } from './TablePaginationActions';

interface ISearchPage {
  pageConfig: PageConfig;
  gridFields: PageGridField[];
  filterFields: PageFilterField[];
  rowActions?: (props: GridRowExtraActionProp) => JSX.Element;
  bulkActions?: (props: GridBulkActionProp) => JSX.Element;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  })
);

export function SearchPage(props: ISearchPage) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let filterFields = props.filterFields;
  let gridFields = props.gridFields;
  const match = useRouteMatch();
  const [status, setStatus] = useState<PageStatus>('loading');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  let defaultValues = UIManager.instance().getDefaultValues();
  const [request, setRequest] = useState<ApiSearchRequest>({
    filter: defaultValues,
    pagination: {
      page: 1,
      perPage: 20,
    },
    sort: {
      field: 'id',
      order: 'ASC',
    },
  });
  const [selections, setSelections] = useState<any[]>([]);

  const classes = useStyles();

  const isHideActions = UIManager.instance().isHideActions();
  const isSelectField = UIManager.instance().isSelectField();

  let timer = useRef<ReturnType<typeof setTimeout>>();
  function loadDataTimer() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      loadData();
    }, 1000);
  }

  function loadData() {
    setStatus('loading');
    if (!request.sort.field) request.sort.field = 'id';
    if (!request.sort.order) request.sort.order = 'ASC';

    new ApiBusinessLogic()
      .search(pageConfig.route, request)
      .then((response) => {
        setTotal(response.total);
        setData(response.value);
        setStatus(response.value.length > 0 ? 'done' : 'no-data');
      })
      .catch((error) => {
        setStatus('none');
        throw error;
      });
  }

  function exportData(e: any) {
    e.preventDefault();
    UIManager.instance().displayLoading(true);
    var requestExport = { ...request };
    requestExport.pagination.page = 1;
    requestExport.pagination.perPage = 0;
    new ApiBusinessLogic()
      .search(pageConfig.route, requestExport)
      .then((response) => {
        var dataForExport = response.value.map((x: any) =>
          gridFields.map((f) => ({
            value: f.enumName ? LibService.instance().translatEnum(f.enum, f.enumName, get(x, f.name)) : get(x, f.name),
            type: f.dataType || 'string',
          }))
        );
        var headers = gridFields.map((x) => ({ value: LibService.instance().getFieldLabel(pageConfig, x.name), type: 'string' }));
        dataForExport.unshift(headers);

        zipcelx({
          filename: LibService.instance().getRouteLabel(pageConfig) + '_' + new Date().getTime(),
          sheet: {
            data: dataForExport,
          },
        });
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        UIManager.instance().displayLoading(false);
      });
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    request.pagination.page = newPage + 1;
    setRequest({ ...request });
    loadDataTimer();
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    request.pagination.page = 1;
    request.pagination.perPage = parseInt(event.target.value, 10);
    setRequest({ ...request });
    loadDataTimer();
  };

  const changeSort = (field: string) => () => {
    if (request.sort.field == field) {
      request.sort.order = request.sort.order == 'ASC' ? 'DESC' : 'ASC';
    } else {
      request.sort.field = field;
      request.sort.order = 'ASC';
    }
    setRequest({ ...request });
    loadDataTimer();
  };

  function selectedIndex(dataRow: any): number {
    return selections.indexOf(dataRow['id']);
  }
  function isSelected(dataRow: any): boolean {
    return selectedIndex(dataRow) != -1;
  }
  function toggleSelected(dataRow: any) {
    return () => {
      var index = selectedIndex(dataRow);
      if (index > -1) {
        selections.splice(index, 1);
      } else {
        selections.push(dataRow['id']);
      }
      setSelections([...selections]);
    };
  }
  function isAllSelected(): boolean {
    return selections.length === data.length;
  }

  function masterToggle() {
    return () => {
      if (isAllSelected()) {
        setSelections([]);
        return;
      }
      setSelections(data.map((x) => x['id']));
    };
  }

  function closeDialog(record?: any) {
    return () => {
      // @ts-ignore
      var callback = window.parent['iframeCallback' + UIManager.instance().getDialogId()];
      if (callback) {
        callback(record);
      }
    };
  }

  useEffect(() => {
    loadData();
    var refreshSubscription = LibService.instance().refreshPage.subscribe(() => {
      loadData();
    });
    return () => {
      refreshSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="list-container">
      <div className="list-actions">
        <div className="container-left">
          {!isHideActions && (
            <>
              {pageConfig.export && (
                <Button variant="outlined" color="default" onClick={exportData} startIcon={<ExportIcon />} className="mr10">
                  {LocaleService.instance().translate('lib.action.export')}
                </Button>
              )}
              {pageConfig.new && (
                <Button
                  component={Link}
                  to={UIManager.instance().getLink('create', pageConfig, { preserveQueryParams: true })}
                  color="primary"
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  {LocaleService.instance().translate('lib.action.add')}
                </Button>
              )}
            </>
          )}
        </div>
        <div></div>
        <div className="container-right">
          {props.bulkActions &&
            selections.length > 0 &&
            props.bulkActions(
              new GridBulkActionProp({
                pageConfig,
                gridFields,
                data,
                selections,
              })
            )}
        </div>
      </div>
      <Paper className={classes.paper}>
        <div className="list-search">
          {!UIManager.instance().isHideFilters() &&
            filterFields.map((field, i) => {
              var path = LibService.instance().getPath(field.prefix, field.name);
              if (UIManager.instance().isHideDefaultFilters()) {
                if (Object.keys(defaultValues).indexOf(field.name) != -1) return null;
              }
              return (
                <div key={i} className="list-search-fields">
                  {React.createElement(
                    field.filterComponent || allInputs.FilterComponent,
                    new FilterComponentProp({
                      key: i,
                      pageConfig,
                      filterFields: filterFields,
                      filterField: field,
                      request: request,
                      data: request.filter,
                      rowData: LibService.instance().getValue(request.filter, path),
                      onChange: (value: any) => {
                        console.log('filter onChange', value);
                        
                        if (field.reference) {
                          var refPath = LibService.instance().getPath(field.prefix, field.reference.dataField);
                          LibService.instance().setValue(request.filter, refPath, value);
                          LibService.instance().setValue(request.filter, path, value instanceof Array ? value?.map((x) => x.id) : value?.id);
                        } else {
                          LibService.instance().setValue(request.filter, path, value);
                        } 
                        request.pagination.page = 1;
                        setRequest({ ...request });
                        loadDataTimer();
                      },
                      className: 'filter-field',
                    })
                  )}
                </div>
              );
            })}
        </div>
        {status == 'loading' && <div className="p20">{UIManager.instance().renderLoading()}</div>}
        {status == 'done' && (
          <TableContainer>
            <Table className={classes.table} aria-labelledby="tableTitle" size={'small'} aria-label="enhanced table">
              <TableHead>
                <TableRow>
                  {isSelectField && <TableCell></TableCell>}
                  {props.bulkActions && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={isAllSelected()} onChange={masterToggle()} inputProps={{ 'aria-label': 'select all desserts' }} />
                    </TableCell>
                  )}
                  {gridFields.map((field, index) => {
                    var sortDirection: SortDirection = request.sort.field == field.name ? (request.sort.order == 'ASC' ? 'asc' : 'desc') : false;
                    const label = LocaleService.instance().translate('resources.' + pageConfig.route + '.fields.' + field.name, field.name);
                    return (
                      <TableCell key={index} sortDirection={sortDirection}>
                        {field.isSortable && (
                          <TableSortLabel active={request.sort.field == field.name} direction={sortDirection || undefined} onClick={changeSort(field.name)}>
                            {label}
                            {<span className={classes.visuallyHidden}>{sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>}
                          </TableSortLabel>
                        )}
                        {!field.isSortable && label}
                      </TableCell>
                    );
                  })}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item: any, i) => {
                  var isItemSelected = isSelected(data[i]);
                  return (
                    <TableRow
                      hover
                      //onClick={(event) => handleClick(event, row.name)}
                      //role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={item.id}
                      selected={isItemSelected}
                    >
                      {isSelectField && (
                        <TableCell>
                          <Button variant="contained" color="inherit" size="small" onClick={closeDialog(data[i])}>
                            {LocaleService.instance().translate('lib.action.select')}
                          </Button>
                        </TableCell>
                      )}
                      {props.bulkActions && (
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={toggleSelected(data[i])} inputProps={{ 'aria-labelledby': '' }} />
                        </TableCell>
                      )}
                      {gridFields.map((gridField, j) => {
                        return (
                          <TableCell key={j}>
                            {React.createElement(
                              gridField.gridComponent || allInputs.GridFieldComponent,
                              new GridComponentProp({
                                key: j,
                                pageConfig,
                                gridFields,
                                gridField,
                                data,
                                rowData: data[i],
                              })
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell align="right">
                        {!isHideActions && (
                          <div>
                            {props.rowActions &&
                              props.rowActions(
                                new GridRowExtraActionProp({
                                  key: i,
                                  pageConfig,
                                  gridFields,
                                  data,
                                  rowData: data[i],
                                })
                              )}
                            {pageConfig.edit && (
                              <Button
                                component={Link}
                                to={match.url + '/edit/' + data[i]['id']}
                                size="small"
                                variant="text"
                                color="secondary"
                                startIcon={<EditIcon />}
                              >
                                {LocaleService.instance().translate('lib.action.edit')}
                              </Button>
                            )}
                            {pageConfig.get && (
                              <Button
                                component={Link}
                                to={match.url + '/detail/' + data[i]['id']}
                                size="small"
                                variant="text"
                                color="secondary"
                                startIcon={<DetailIcon />}
                              >
                                {LocaleService.instance().translate('lib.action.show')}
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {status == 'done' && total > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={total}
            rowsPerPage={request.pagination.perPage}
            page={request.pagination.page - 1}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}            
            ActionsComponent={TablePaginationActions}
          />
        )}
        {status == 'no-data' && <div className="p20">{LocaleService.instance().translate('lib.page.no_data')}</div>}
      </Paper>
    </div>
  );
}
