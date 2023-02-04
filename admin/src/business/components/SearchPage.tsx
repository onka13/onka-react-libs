import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import zipcelx from 'zipcelx';
import get from 'lodash/get';
import {
  Button,
  createStyles,
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
} from '@mui/material';
import ExportIcon from '@mui/icons-material/ImportExport';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailIcon from '@mui/icons-material/RemoveRedEye';
import { PageConfig } from '../../data/lib/PageConfig';
import { ApiSearchRequest } from '../../data/api/ApiRequest';
import { UIManager } from '../services/UIManager';
import { ApiBusinessLogic } from '../services/ApiBusinessLogic';
import { allInputs } from '../../ui/panel/components/form/index';
import { GridComponentProp } from '../../data/lib/GridComponentProp';
import { GridRowExtraActionProp } from '../../data/lib/GridRowExtraActionProp';
import { GridBulkActionProp } from '../../data/lib/GridBulkActionProp';
import { LibService } from '../services/LibService';
import { PageStatus } from '../../data/lib/Types';
import { LocaleService } from '../services/LocaleService';
import { PageGridField } from '../../data/lib/PageGridFields';
import { TablePaginationActions } from './TablePaginationActions';
import { InputComponentProp } from '../../data/lib/InputComponentProp';
import { PageField } from '../../data/lib/PageField';
import { HandleChangeType, useForm } from '../helpers/UseForm';
import { useFilterView } from './useFilterView';
import { makeStyles } from './makesStyles';

interface ISearchPage {
  pageConfig: PageConfig;
  gridFields: PageGridField[];
  filterFields: PageField[];
  fields: PageField[];
  rowActions?: (props: GridRowExtraActionProp) => JSX.Element;
  bulkActions?: (props: GridBulkActionProp) => JSX.Element;
  hideActions?: boolean;
  hideFilters?: boolean;
  noPaging?: boolean;
  initialData?: any;
  disableOnload?: boolean;
  defaultSort?: string;
  defaultSortOrder?: string;
  leftComponents?: JSX.Element;
  rightComponents?: JSX.Element;
  pageSize?: number;
}

const useStyles = makeStyles()((theme: Theme) => ({
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
}));

export function SearchPage(props: ISearchPage) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let gridFields = props.gridFields;
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PageStatus>('loading');
  const [data, setData] = useState(props.initialData || []);
  const [total, setTotal] = useState(0);
  let defaultValues = UIManager.instance().getDefaultValues();
  const refRequest = useRef<ApiSearchRequest>({
    filter: defaultValues,
    pagination: {
      page: UIManager.instance().getPageNumber(),
      perPage: props.pageSize ?? 50,
    },
    sort: {
      field: UIManager.instance().getSort(props.defaultSort),
      order: UIManager.instance().getSortOrder(props.defaultSortOrder),
    },
  });
  // const [request, setRequest] = useState<ApiSearchRequest>({
  //   filter: defaultValues,
  //   pagination: {
  //     page: UIManager.instance().getPageNumber(),
  //     perPage: 20,
  //   },
  //   sort: {
  //     field: 'id',
  //     order: 'ASC',
  //   },
  // });
  const getRequest = () => refRequest.current;
  const setRequest = (val: ApiSearchRequest) => (refRequest.current = val);
  const [selections, setSelections] = useState<any[]>([]);

  const { classes, cx } = useStyles();

  useEffect(() => {
    setData(props.initialData || []);
  }, [props.initialData]);

  useEffect(() => {
    var request = getRequest();
    request.filter = UIManager.instance().getDefaultValues();
    request.pagination.page = UIManager.instance().getPageNumber();
    request.sort.field = UIManager.instance().getSort(props.defaultSort);
    request.sort.order = UIManager.instance().getSortOrder(props.defaultSortOrder);
    setRequest(request);
    loadDataTimer(true);
  }, [location]);

  const isHideActions = UIManager.instance().isHideActions() || props.hideActions;
  const isSelectField = UIManager.instance().isSelectField();
  const isHideFilters = UIManager.instance().isHideFilters() || props.hideFilters;

  let timer = useRef<ReturnType<typeof setTimeout>>();
  function loadDataTimer(fromUrlChangeEvent: boolean = false) {
    if (!fromUrlChangeEvent) {
      var request = getRequest();
      UIManager.instance().changeQueryParams(navigate, {
        page: request.pagination.page,
        perPage: request.pagination.perPage,
        sort: request.sort.field,
        sortOrder: request.sort.order,
        defaultValues: JSON.stringify(request.filter),
      });
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      loadData();
    }, 1000);
  }

  function loadData() {
    if (props.disableOnload) {
      setStatus('done');
      return;
    }
    setStatus('loading');
    var request = getRequest();
    if (!request.sort.field) request.sort.field = 'id';
    if (!request.sort.order) request.sort.order = 'ASC';

    new ApiBusinessLogic()
      .search(pageConfig.route, request)
      .then((response) => {
        form?.clear();
        updateData(response.value, response.total);
      })
      .catch((error) => {
        setStatus('none');
        throw error;
      });
  }

  function updateData(value: any, total?: number) {
    if (total) setTotal(total);
    setData(value);
    setStatus(value.length > 0 ? 'done' : 'no-data');
  };

  function updateRowData(index: number, value: any) {
    data[index] = value;
    updateData([...data]);
  };

  console.log('s2 render', data.length, data);

  function deleteItem(id: any) {
    UIManager.instance().confirm({}, (response) => {
      if (!response || !response.value) return;
      new ApiBusinessLogic().delete(pageConfig.route, id).then((response) => {
        loadData();
      });
    });
  }

  function exportData(e: any) {
    e.preventDefault();
    UIManager.instance().displayLoading(true);
    var request = getRequest();
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
    var request = getRequest();
    request.pagination.page = newPage + 1;
    setRequest(request);
    loadDataTimer();
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    var request = getRequest();
    request.pagination.page = 1;
    request.pagination.perPage = parseInt(event.target.value, 10);
    setRequest(request);
    loadDataTimer();
  };

  const changeSort = (field: string) => () => {
    var request = getRequest();
    if (request.sort.field == field) {
      request.sort.order = request.sort.order == 'ASC' ? 'DESC' : 'ASC';
    } else {
      request.sort.field = field;
      request.sort.order = 'ASC';
    }
    setRequest(request);
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
      setSelections(data.map((x: any) => x['id']));
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
    loadDataTimer(true);
    var refreshSubscription = LibService.instance().refreshPage.subscribe(() => {
      loadDataTimer(true);
    });
    return () => {
      refreshSubscription.unsubscribe();
    };
  }, []);

  function onFilterChanged(data: any) {
    const request = getRequest();
    request.filter = data;
    request.pagination.page = 1;
    setRequest(request);
    loadDataTimer();
  }

  const FilterView = useFilterView({
    defaultValues: UIManager.instance().getDefaultValues(),
    values: getRequest().filter,
    filterFields: pageConfig.filterFields,
    onLoadData: onFilterChanged,
    pageConfig: pageConfig,
    isHideFilters: isHideFilters,
  });

  const renderSearchBody = () => {
    return (
      <TableBody>
        {data.map((item: any, i: number) => {
          var isItemSelected = isSelected(data[i]);
          return (
            <TableRow
              hover
              //onClick={(event) => handleClick(event, row.name)}
              //role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={i}
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
                          updateData,
                          updateRowData: (value: any) => updateRowData(i, value),
                        })
                      )}
                    {pageConfig.delete && (
                      <Button
                        size="small"
                        variant="text"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={(e: any) => {
                          e.preventDefault();
                          deleteItem(data[i]['id']);
                        }}
                      >
                        {LocaleService.instance().translate('lib.action.delete')}
                      </Button>
                    )}
                    {pageConfig.edit && (
                      <Button
                        component={Link}
                        to={UIManager.instance().getLink('edit', pageConfig, { id: data[i]['id'], preserveQueryParams: true })}
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
                        to={UIManager.instance().getLink('detail', pageConfig, { id: data[i]['id'], preserveQueryParams: true })}
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
    );
  };

  const form = useForm();

  const onSubmitUpdateForm = async function (formKey: string, e: any) {
    e.preventDefault();
    UIManager.instance().displayLoading(true);
    var record = await new ApiBusinessLogic().updateOnly(pageConfig.route, form.getFormData(formKey));
    UIManager.instance().displayLoading(false);
    if (record.value?.id) {
      form.updateFormData(formKey, { ...form.getFormData(formKey), ...record.value });
    }
  };

  const FieldComponent = useCallback(
    (fieldCompProps: { fields: PageField[]; field: PageField; formKey: string }) => {
      const inputProps = new InputComponentProp({
        key: fieldCompProps.field.name,
        pageConfig: props.pageConfig,
        fields: fieldCompProps.fields,
        field: fieldCompProps.field,
        isEdit: true,
        className: 'inline-edit-field',
        form: form,
        path: LibService.instance().getPath(fieldCompProps.field.prefix, fieldCompProps.field.name),
        formKey: fieldCompProps.formKey,
      });

      if (fieldCompProps.field.editComponent) return <fieldCompProps.field.editComponent {...inputProps} />;
      return <allInputs.InputComponent {...inputProps} />;
    },
    [props.pageConfig]
  );

  const renderInlineEditBody = () => {
    return (
      <TableBody>
        {data.map((item: any, i: number) => {
          var isItemSelected = isSelected(data[i]);
          const formKey = item.id;
          form.initForm({
            formKey: formKey,
            fields: props.fields,
            initialValues: { ...item },
          });
          return (
            <TableRow hover aria-checked={isItemSelected} tabIndex={-1} key={item.id} selected={isItemSelected}>
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
                const field = props.fields?.filter((x) => x.name == gridField.name)[0];
                return (
                  <TableCell key={j} className="inline-cell">
                    <FieldComponent key={gridField.name} fields={props.fields} field={field} formKey={formKey} />

                    {/* {React.createElement(
                        gridField.gridComponent || allInputs.GridFieldComponent,
                        new GridComponentProp({
                          key: j,
                          pageConfig,
                          gridFields,
                          gridField,
                          data,
                          rowData: data[i],
                        })
                      )} */}
                  </TableCell>
                );
              })}
              <TableCell align="right">
                <div>
                  <Button size="small" variant="text" color="secondary" startIcon={<EditIcon />} onClick={(e) => onSubmitUpdateForm(formKey, e)}>
                    {LocaleService.instance().translate('lib.action.save')}
                  </Button>
                  {props.rowActions && (
                    <props.rowActions
                      {...new GridRowExtraActionProp({
                        key: i,
                        pageConfig,
                        gridFields,
                        data,
                        rowData: data[i],
                        form,
                        formKey,
                      })}
                    />
                  )}
                  {pageConfig.edit && (
                    <Button
                      component={Link}
                      to={location.pathname + '/edit/' + data[i]['id']}
                      size="small"
                      variant="text"
                      color="secondary"
                      startIcon={<EditIcon />}
                    >
                      {LocaleService.instance().translate('lib.action.edit')}
                    </Button>
                  )}
                  {pageConfig.delete && (
                    <Button
                      size="small"
                      variant="text"
                      color="secondary"
                      startIcon={<DeleteIcon />}
                      onClick={(e: any) => {
                        e.preventDefault();
                        deleteItem(data[i]['id']);
                      }}
                    >
                      {LocaleService.instance().translate('lib.action.delete')}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  };

  return (
    <div className="list-container">
      <div className="list-actions">
        <div className="container-left">
          {!isHideActions && (
            <>
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
              {props.leftComponents}
            </>
          )}
        </div>
        <div></div>
        <div className="container-right">
          {!isHideActions && (
            <>
              {pageConfig.export && (
                <Button variant="outlined" color="inherit" onClick={exportData} startIcon={<ExportIcon />} className="mr10">
                  {LocaleService.instance().translate('lib.action.export')}
                </Button>
              )}
            </>
          )}
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
          {!isHideActions && <>{props.rightComponents}</>}
        </div>
      </div>
      <Paper className={classes.paper}>{FilterView}</Paper>
      <Paper className={classes.paper}>
        {status == 'loading' && <div className="p20">{UIManager.instance().renderLoading()}</div>}
        {status == 'done' && (
          <TableContainer>
            <Table className={classes.table} aria-labelledby="tableTitle" size={'small'} aria-label="enhanced table">
              <TableHead>
                <TableRow>
                  {isSelectField && <TableCell></TableCell>}
                  {props.bulkActions && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={isAllSelected()} onChange={masterToggle()} inputProps={{ 'aria-label': 'select all' }} />
                    </TableCell>
                  )}
                  {gridFields.map((field, index) => {
                    var sortDirection: SortDirection = getRequest().sort.field == field.name ? (getRequest().sort.order == 'ASC' ? 'asc' : 'desc') : false;
                    const label = LocaleService.instance().translate('resources.' + pageConfig.route + '.fields.' + field.name, field.name);
                    return (
                      <TableCell key={index} sortDirection={sortDirection}>
                        {field.isSortable && (
                          <TableSortLabel
                            active={getRequest().sort.field == field.name}
                            direction={sortDirection || undefined}
                            onClick={changeSort(field.name)}
                          >
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
              {props.pageConfig.inlineEditing ? renderInlineEditBody() : renderSearchBody()}
            </Table>
          </TableContainer>
        )}
        {!props.noPaging && status == 'done' && total > 0 && (
          <Table className={classes.table} size={'small'} aria-label="enhanced table">
            <TableBody>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  count={total}
                  rowsPerPage={getRequest().pagination.perPage}
                  page={getRequest().pagination.page - 1}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableBody>
          </Table>
        )}
        {status == 'no-data' && <div className="p20">{LocaleService.instance().translate('lib.page.no_data')}</div>}
      </Paper>
    </div>
  );
}
