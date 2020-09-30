import React, { useEffect, useRef, useState } from 'react';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { ApiSearchRequest } from '../../../../data/api/ApiRequest';
import { LibService } from '../../../../business/services/LibService';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { ApiBusinessLogic } from '../../../../business/services/ApiBusinessLogic';
import { TextField, CircularProgress, Checkbox } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

export function MultiReferenceComponent(props: InputComponentProp) {
  return <ReferenceComponentBase isMultiple={true} props={props} />;
}
export function ReferenceComponent(props: InputComponentProp) {
  return <ReferenceComponentBase isMultiple={false} props={props} />;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function ReferenceComponentBase({ isMultiple, props }: { isMultiple: boolean; props: InputComponentProp }) {
  const [options, setOptions] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const timer = useRef<number>(-1);

  const makeRequest = (term: String) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLoading(true);
      var request = new ApiSearchRequest();
      request.pagination.page = 1;
      request.pagination.perPage = props.field.reference.pageSize || 10;
      request.sort.field = props.field.reference.sortField || 'id';
      request.sort.order = props.field.reference.sortDirection || 'ASC';
      request.filter[props.field.reference.filterField] = term;
      new ApiBusinessLogic()
        .search(props.field.reference.route, request)
        .then((response) => {
          setOptions(response.value);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  };
  const handleChange = (e: any, newValue: any) => {
    props.onChange(newValue);
  };
  const handleInputChange = async (e: any, newInputValue: any) => {
    makeRequest(newInputValue);
  };
  const getOptionLabel = (option: any) => {
    return option[props.field.reference.filterField] || '';
  };
  const getOptionSelected = (option: any, value: any) => {
    return option.id == value.id;
  };
  const onOpen = (e: any) => {
    // first open
    if (timer.current == -1) makeRequest('');
  };
  var value = props.data[props.field.reference.dataField];
  if (!value) {
    value = isMultiple ? [] : {};
  }
  return (
    <Autocomplete
      id={props.field.name}
      value={value}
      options={options}
      openOnFocus={true}
      loading={loading}
      multiple={isMultiple}
      disableCloseOnSelect={isMultiple}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      onChange={handleChange}
      onOpen={onOpen}
      filterOptions={(options: any, state: object) => options}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
            onChange={(e) => {
              handleInputChange(e, e.target.value);
            }}
            InputProps={{
              ...params.InputProps,
              readOnly: loading,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        );
      }}
      renderOption={(option, { selected }) => {
        if (!isMultiple) return getOptionLabel(option);
        return (
          <React.Fragment>
            <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
            {getOptionLabel(option)}
          </React.Fragment>
        );
      }}
    />
  );
}
