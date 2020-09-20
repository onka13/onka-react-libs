import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { PageConfig } from '../../data/lib/PageConfig';
import { PageField } from '../../data/lib/PageField';
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
import zipcelx from 'zipcelx';
import get from 'lodash/get';

interface ISearchPage {
  pageConfig: PageConfig;
  gridFields: PageField[];
  filterFields: PageField[];
  rowActions?: (props: GridRowExtraActionProp) => JSX.Element;
  bulkActions?: (props: GridBulkActionProp) => JSX.Element;
}

export function SearchPage(props: ISearchPage) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let filterFields = props.filterFields;
  let gridFields = props.gridFields;
  let match = useRouteMatch();
  const [status, setStatus] = useState<PageStatus>('loading');
  const [data, setData] = useState([]);
  const [pageLength, setPageLength] = useState(0);
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
        setData(response.value);
        setStatus(response.value.length > 0 ? 'done' : 'no-data');
        setPageLength(response.value.length);
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

  function changePage(page: number) {
    request.pagination.page = page;
    setRequest({ ...request });
    loadDataTimer();
  }

  function changeSort(field: string) {
    if (request.sort.field == field) {
      request.sort.order = request.sort.order == 'ASC' ? 'DESC' : 'ASC';
    } else {
      request.sort.field = field;
      request.sort.order = 'ASC';
    }
    setRequest({ ...request });
    loadDataTimer();
  }

  function selectedIndex(dataRow: any): number {
    return selections.indexOf(dataRow['id']);
  }
  function isSelected(dataRow: any): boolean {
    return selectedIndex(dataRow) != -1;
  }
  function toggleSelected(dataRow: any) {
    return (e: any) => {
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
    return (e: any) => {
      if (isAllSelected()) {
        setSelections([]);
        return;
      }
      setSelections(data.map((x) => x['id']));
    };
  }

  function closeDialog(record?: any) {
    return (e: any) => {
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

  let totalPage = Math.floor(data.length / request.pagination.perPage) + 1;

  return (
    <div className="nk-block nk-block-lg">
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <div className="nk-block-head-content">
            <div className="toggle-wrap nk-block-tools-toggle">
              <div className="toggle-expand-content" data-content="pageMenu">
                {!isHideActions && (
                  <ul className="nk-block-tools g-3">
                    <li>
                      <a href="#" className="btn btn-white btn-outline-light" onClick={exportData}>
                        <em className="icon ni ni-download-cloud"></em>
                        <span>{LocaleService.instance().translate('lib.action.export')}</span>
                      </a>
                    </li>
                    {pageConfig.new && (
                      <li>
                        <Link to={UIManager.instance().getLink('create', pageConfig, { preserveQueryParams: true })} className="btn btn-primary">
                          <em className="icon ni ni-plus"></em>
                          <span>{LocaleService.instance().translate('lib.action.add')}</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div>
            {props.bulkActions &&
              selections.length > 0 &&
              props.bulkActions(
                new GridBulkActionProp({
                  pageConfig,
                  fields: gridFields,
                  data,
                  selections,
                })
              )}
          </div>
        </div>
      </div>
      <div className="card card-preview">
        <div className="card-inner">
          <div className="dataTables_wrapper dt-bootstrap4 no-footer">
            <div className="row justify-between g-2">
              <div className="col-7 col-sm-6 text-left">
                <div className="d-flex">
                  {!UIManager.instance().isHideFilters() &&
                    filterFields.map((field, i) => {
                      var path = LibService.instance().getPath(field.prefix, field.name);
                      if (UIManager.instance().isHideDefaultFilters()) {
                        if (Object.keys(defaultValues).indexOf(field.name) != -1) return null;
                      }
                      return (
                        <div key={i} className="mr10">
                          {React.createElement(
                            field.filterComponent || allInputs.FilterComponent,
                            new FilterComponentProp({
                              key: i,
                              pageConfig,
                              fields: filterFields,
                              field,
                              data,
                              request: request,
                              rowData: LibService.instance().getValue(request.filter, path),
                              onChange: (val: string) => {
                                LibService.instance().setValue(request.filter, path, val);
                                setRequest({ ...request });
                                loadDataTimer();
                              },
                            })
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="col-5 col-sm-6 text-right d-flex justify-content-end"></div>
            </div>
            {status == 'loading' && <div className="mt20">{UIManager.instance().renderLoading()}</div>}
            <div className="datatable-wrap my-3">
              {status == 'done' && (
                <table
                  className="datatable-init nk-tb-list nk-tb-ulist dataTable no-footer"
                  data-auto-responsive="false"
                  role="grid"
                  aria-describedby="DataTables_Table_1_info"
                >
                  <thead>
                    <tr className="nk-tb-item nk-tb-head" role="row">
                      {isSelectField && <th className="nk-tb-col"></th>}
                      {props.bulkActions && (
                        <th className="nk-tb-col nk-tb-col-check">
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input type="checkbox" className="custom-control-input" id="check-master" checked={isAllSelected()} onChange={masterToggle()} />
                            <label className="custom-control-label" htmlFor="check-master"></label>
                          </div>
                        </th>
                      )}
                      {gridFields.map((field, index) => {
                        var sortClass = request.sort.field == field.name ? (request.sort.order == 'ASC' ? 'sorting_asc' : 'sorting_desc') : '';
                        return (
                          <th key={index} className={'nk-tb-col sorting ' + sortClass} rowSpan={1} colSpan={1}>
                            <a href="#" className="sub-text" onClick={(e) => changeSort(field.name)}>
                              {LocaleService.instance().translate('resources.' + pageConfig.route + '.fields.' + field.name, field.name)}
                            </a>
                          </th>
                        );
                      })}
                      <th className="nk-tb-col nk-tb-col-tools text-right sorting" rowSpan={1} colSpan={1}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, i) => {
                      return (
                        <tr key={i} className="nk-tb-item odd" role="row">
                          {isSelectField && (
                            <td className="nk-tb-col">
                              <button className="btn btn-sm btn-light" onClick={closeDialog(data[i])}>
                                {LocaleService.instance().translate('lib.action.select')}
                              </button>
                            </td>
                          )}
                          {props.bulkActions && (
                            <td className="nk-tb-col nk-tb-col-check sorting_1">
                              <div className="custom-control custom-control-sm custom-checkbox notext">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id={'check' + i}
                                  checked={isSelected(data[i])}
                                  onChange={toggleSelected(data[i])}
                                />
                                <label className="custom-control-label" htmlFor={'check' + i}></label>
                              </div>
                            </td>
                          )}
                          {gridFields.map((field, j) => {
                            return (
                              <td key={j} className="nk-tb-col">
                                {React.createElement(
                                  field.gridComponent || allInputs.GridFieldComponent,
                                  new GridComponentProp({
                                    key: j,
                                    pageConfig,
                                    fields: gridFields,
                                    field,
                                    data,
                                    rowData: data[i],
                                  })
                                )}
                              </td>
                            );
                          })}
                          <td className="nk-tb-col nk-tb-col-tools">
                            {!isHideActions && (
                              <ul className="nk-tb-actions gx-1">
                                {props.rowActions &&
                                  props.rowActions(
                                    new GridRowExtraActionProp({
                                      key: i,
                                      pageConfig,
                                      fields: gridFields,
                                      data,
                                      rowData: data[i],
                                    })
                                  )}
                                {pageConfig.edit && (
                                  <li className="nk-tb-action-hidden">
                                    <Link
                                      to={match.url + '/edit/' + data[i]['id']}
                                      className="btn btn-trigger btn-icon"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                    >
                                      <em className="icon ni ni-edit"></em>
                                      <span>{LocaleService.instance().translate('lib.action.edit')}</span>
                                    </Link>
                                  </li>
                                )}
                                {pageConfig.get && (
                                  <li className="nk-tb-action-hidden">
                                    <Link
                                      to={match.url + '/detail/' + data[i]['id']}
                                      className="btn btn-trigger btn-icon"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                    >
                                      <em className="icon ni ni-list-round"></em>
                                      <span>{LocaleService.instance().translate('lib.action.show')}</span>
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            {status == 'done' && (
              <div className="row align-items-center">
                <div className="col-7 col-sm-12 col-md-9">
                  <div className="dataTables_paginate paging_simple_numbers" id="DataTables_Table_1_paginate">
                    <ul className="pagination">
                      <li className={'paginate_button page-item previous' + (request.pagination.page > 1 ? '' : 'disabled')}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (request.pagination.page <= 1) return;
                            changePage(request.pagination.page - 1);
                          }}
                          className="page-link"
                        >
                          {LocaleService.instance().translate('lib.action.prev')}
                        </a>
                      </li>

                      <li className="paginate_button page-item active">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          className="page-link"
                        >
                          {request.pagination.page}
                        </a>
                      </li>

                      <li className={'paginate_button page-item next' + (request.pagination.page < totalPage ? '' : 'disabled')}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (request.pagination.page >= totalPage) return;
                            changePage(request.pagination.page + 1);
                          }}
                          className="page-link"
                        >
                          {LocaleService.instance().translate('lib.action.next')}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-5 col-sm-12 col-md-3 text-left text-md-right d-flex justify-content-end">
                  <div className="dataTables_info mr10" role="status" aria-live="polite">
                    {(request.pagination.page - 1) * request.pagination.perPage + 1} - {request.pagination.page * request.pagination.perPage}, {data.length}
                  </div>
                  <div className="datatable-filter">
                    <div className="dataTables_length">
                      <label>
                        <div className="form-control-select">
                          {' '}
                          <select
                            name="DataTables_Table_1_length"
                            className="custom-select custom-select-sm form-control form-control-sm"
                            onChange={(e) => {
                              request.pagination.page = 1;
                              request.pagination.perPage = parseInt(e.target.value);
                              setRequest({ ...request });
                              loadDataTimer();
                            }}
                            defaultValue={request.pagination.perPage}
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>{' '}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {status == 'no-data' && <div className="m20">{LocaleService.instance().translate('lib.page.no_data')}</div>}
          </div>
        </div>{' '}
      </div>
    </div>
  );
}
