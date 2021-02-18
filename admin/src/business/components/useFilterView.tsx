import React, { useRef } from 'react';
import { PageConfig } from '../../data/lib/PageConfig';
import { UIManager } from '../services/UIManager';
import { allInputs } from '../../ui/panel/components/form/index';
import { LibService } from '../services/LibService';
import { InputComponentProp } from '../../data/lib/InputComponentProp';
import { PageField } from '../../data/lib/PageField';
import { useForm } from '../helpers/UseForm';

export interface IFilterView {
  pageConfig: PageConfig;
  filterFields: PageField[];
  defaultValues: any;
  values: any;
  onLoadData: (data: any) => void;
  isHideFilters?: boolean;
}

export function useFilterView(props: IFilterView) {
  let timer = useRef<ReturnType<typeof setTimeout>>();
  const formKey = props.pageConfig.route;

  function loadDataTimer() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      props.onLoadData(form.getFormData(formKey));
    }, 1000);
  }

  const form = useForm();
  form.initForm({
    formKey: formKey,
    fields: [],
    initialValues: { ...props.defaultValues, ...props.values },
    onAfterChanges: loadDataTimer,
  });

  /*const onChange = (field: PageField, value: any) => {
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
  };*/

  console.log('useFilterView render');
  return (
    <div>
      <div className="list-search">
        {!props.isHideFilters &&
          props.filterFields.map((field, i) => {
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
                    fields: props.filterFields,
                    field: field,
                    className: 'filter-field',
                    isFilter: true,
                    form: form,
                    path: LibService.instance().getPath(field.prefix, field.name),
                  })
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
