import React, { useRef } from 'react';
import { PageConfig } from '../../data/lib/PageConfig';
import { UIManager } from '../services/UIManager';
import { allInputs } from '../../ui/panel/components/form/index';
import { LibService } from '../services/LibService';
import { InputComponentProp } from '../../data/lib/InputComponentProp';
import { PageField } from '../../data/lib/PageField';
import { HandleChangeType } from '../helpers/UseForm';

export interface IFilterView {
  pageConfig: PageConfig;
  filterFields: PageField[];
  defaultValues: any;
  values: any;
  onLoadData: (data: any) => void;
  isHideFilters?: boolean;
}

export function useFilterView(props: IFilterView) {
  const refRequest = useRef({ ...props.defaultValues, ...props.values });
  const getRequest = () => refRequest.current;
  const setRequest = (val: any) => (refRequest.current = val);

  let timer = useRef<ReturnType<typeof setTimeout>>();
  function loadDataTimer() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      props.onLoadData(getRequest());
    }, 1000);
  }

  const handleChanges = (values: HandleChangeType[]) => {
    var dataCloned = { ...getRequest() };
    for (let i = 0; i < values.length; i++) {
      const item = values[i];
      LibService.instance().setValue(dataCloned, item.name, item.value);
    }
    setRequest(dataCloned);
    loadDataTimer();
  };

  const onChange = (field: PageField, value: any) => {
    var request = getRequest();
    console.log('useFilterView onChange value', value);
    console.log('useFilterView onChange request', request);

    var path = LibService.instance().getPath(field.prefix, field.name);
    if (field.reference) {
      var refPath = LibService.instance().getPath(field.prefix, field.reference.dataField);
      LibService.instance().setValue(request, refPath, value);
      LibService.instance().setValue(request, path, value instanceof Array ? value?.map((x) => x.id) : value?.id);
    } else {
      LibService.instance().setValue(request, path, value);
    }
    setRequest(request);
    loadDataTimer();
  };

  const filterComponents = (fields: PageField[]) => {
    var request = getRequest();
    console.log('useFilterView filterComponents', request);
    return (
      <div className="list-search">
        {!props.isHideFilters &&
          fields.map((field, i) => {
            var path = LibService.instance().getPath(field.prefix, field.name);
            if (UIManager.instance().isHideDefaultFilters()) {
              if (Object.keys(props.defaultValues).indexOf(field.name) != -1) return null;
            }
            return (
              <div key={i} className="list-search-fields">
                {React.createElement(
                  field.filterComponent || allInputs.InputComponent,
                  new InputComponentProp({
                    key: i,
                    pageConfig: props.pageConfig,
                    fields: fields,
                    field: field,
                    data: request,
                    rowData: LibService.instance().getValue(request, path),
                    onChange: (value: any) => onChange(field, value),
                    className: 'filter-field',
                    isFilter: true,
                    handleChanges: handleChanges
                  })
                )}
              </div>
            );
          })}
      </div>
    );
  };

  console.log('useFilterView render', getRequest());
  return <div>{filterComponents(props.filterFields)}</div>;
}
