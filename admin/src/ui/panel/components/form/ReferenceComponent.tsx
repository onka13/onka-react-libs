import React, { useEffect, useRef } from 'react';
import { ApiSearchRequest, BaseBusinessLogicService, ConfigService, InputComponentProp, LibService } from '../../../..';

export function MultiReferenceComponent(props: InputComponentProp) {
  return <ReferenceComponentBase isMultiple={true} props={props} />;
}
export function ReferenceComponent(props: InputComponentProp) {
  return <ReferenceComponentBase isMultiple={false} props={props} />;
}
function ReferenceComponentBase({ isMultiple, props }: { isMultiple: boolean; props: InputComponentProp }) {
  const refSelect = React.createRef<HTMLSelectElement>();
  const initialData = useRef(props.rowData || (isMultiple ? [] : ''));
  const initialId = isMultiple ? initialData.current.map((x: any) => x.id) : initialData.current;
  const handleChange = (e: any) => {};
  useEffect(() => {
    if (!refSelect.current) return;
    if (props.readonly) return;
    var request = new ApiSearchRequest();
    request.pagination.perPage = props.field.reference.pageSize || 10;
    request.sort.field = props.field.reference.sortField || 'id';
    request.sort.order = (props.field.reference.sortDirection || 'asc').toUpperCase();

    let $el = $(refSelect.current);
    $el.on('select2:selecting', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      // @ts-ignore
      var data = e.params.args.data;
      $el.select2('close');
      if (isMultiple) {
        initialData.current.push(data);
        props.onChange(initialData.current);
        return;
      }
      props.onChange(data.id);
    });
    $el.on('select2:unselecting', (e) => {
      e.preventDefault();
      // @ts-ignore
      var data = e.params.args.data;
      if (isMultiple) {
        var index = initialData.current.findIndex((x: any) => x.id == data.id);
        if (index >= 0) {
          initialData.current = initialData.current.filter((x: any) => x.id != data.id);
          props.onChange(initialData.current);
        }
        return;
      }
      props.onChange();
    });
    $el.select2({
      placeholder: '',
      allowClear: false,
      tags: false,
      minimumInputLength: 1,
      language: {
        inputTooShort: function () {
          return 'You must enter more characters...';
        },
      },
      multiple: isMultiple,
      ajax: {
        url: ConfigService.instance().getApiUrl() + props.field.reference.reference + '/all',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        delay: 500,
        headers: BaseBusinessLogicService.instance().getHeaders(),
        // @ts-ignore
        data: function (params) {
          var request = new ApiSearchRequest();
          request.pagination.page = params.page || 1;
          request.filter[props.field.reference.filterField] = params.term;
          return JSON.stringify(request);
        },
        processResults: function (data, params) {
          params.page = params.page || 1;
          return {
            results: data.value.map((item: any, index: any) => {
              return { id: item.id, text: item.name };
            }),
            pagination: {
              more: params.page * 10 < data.total_count,
            },
          };
        },
        cache: true,
      },
    });
  }, []);
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={props.field.name}>
        {LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      </label>
      <div className="form-control-wrap">
        <select ref={refSelect} onChange={handleChange} multiple={isMultiple} value={initialId} className={'form-control'} disabled={props.readonly}>
          {!props.field.isRequired && <option></option>}
          {props.field.enum &&
            Object.keys(props.field.enum).map((x, index) => {
              return (
                <option key={index} value={props.field.enum[x]}>
                  {LibService.instance().translatEnumKey(props.field.enumName, x)}
                </option>
              );
            })}
          {isMultiple &&
            initialData.current &&
            initialData.current.map((item: any, i: number) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.text}
                </option>
              );
            })}
        </select>
        {props.error && <span className="invalid">{props.error}</span>}
      </div>
    </div>
  );
}
