import React, { useRef } from 'react';
import { TextField, CircularProgress, Checkbox } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Autocomplete, AutocompleteChangeReason } from '@material-ui/lab';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { ApiSearchRequest } from '../../../../data/api/ApiRequest';
import { LibService } from '../../../../business/services/LibService';
import { ApiBusinessLogic } from '../../../../business/services/ApiBusinessLogic';
import { FilterComponentProp } from '../../../../data/lib/FilterComponentProp';
import { PageReference } from '../../../../data/lib/PageReference';

export function MultiReferenceComponent(props: InputComponentProp | FilterComponentProp) {
  return <ReferenceComponentBase isMultiple={true} props={props} />;
}
export function ReferenceComponent(props: InputComponentProp | FilterComponentProp) {
  return <ReferenceComponentBase isMultiple={false} props={props} />;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function ReferenceComponentBase({ isMultiple, props }: { isMultiple: boolean; props: InputComponentProp | FilterComponentProp }) {
  const [options, setOptions] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);  
  const timer = useRef<number>(-1);

  var name: string;
  var reference: PageReference;
  //console.log('ReferenceComponentBase', props instanceof FilterComponentProp, props instanceof InputComponentProp, props);
  var filter = props as FilterComponentProp;
  if (filter && filter.filterField) {
    name = filter.filterField.filterName;
    reference = filter.filterField.reference;
  } else {
    name = props.field.name;
    reference = props.field.reference;
  }

  var value = props.data ? props.data[reference.dataField] : null;
  if (!value) {
    value = isMultiple ? [] : {};
  }
  const getOptionLabel = (option: any) => {
    return option[reference.filterField] || '';
  };
  const [inputValue, setInputValue] = React.useState(isMultiple ? '' : getOptionLabel(value));

  const makeRequest = (term: String) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLoading(true);
      var request = new ApiSearchRequest();
      request.pagination.page = 1;
      request.pagination.perPage = reference.pageSize || 20;
      request.sort.field = reference.sortField || 'id';
      request.sort.order = reference.sortDirection || 'ASC';
      request.filter[reference.filterField] = term;
      new ApiBusinessLogic()
        .search(reference.route, request)
        .then((response) => {
          setOptions(response.value);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  };
  const onChange = (e: any, newValue: any, reason: AutocompleteChangeReason) => {
    console.log('onChange', newValue, reason);
    if(!isMultiple && reason == 'select-option') setInputValue(getOptionLabel(newValue));
    props.onChange(newValue);    
  };
  const handleInputChange = async (e: any, newInputValue: any) => {
    makeRequest(newInputValue);
  };

  const getOptionSelected = (option: any, value: any) => {
    return option.id == value.id;
  };
  const onOpen = (e: any) => {
    // first open
    if (timer.current == -1) makeRequest('');
  };
  const onInputChange = (event: any, value: any, reason: any) => {
    console.log('onInputChange', value, reason);

    if (reason !== 'reset') {
      setInputValue(value);
    }
  };
  
  console.log('ReferenceComponent render timer.current:', timer.current);
  console.log('ReferenceComponent render inputValue:', inputValue);
  console.log('ReferenceComponent render1 name, value:', name, value);
  console.log('ReferenceComponent render2 props.data:', props.data);
  return (
    <Autocomplete
      id={name}
      value={value}
      options={options}
      openOnFocus={true}
      loading={loading}
      multiple={isMultiple}
      disableCloseOnSelect={isMultiple}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      onChange={onChange}
      onOpen={onOpen}
      filterOptions={(options: any, state: object) => options}
      className={props.className}
      fullWidth
      inputValue={!isMultiple ? inputValue : undefined}
      onInputChange={!isMultiple ? onInputChange : undefined}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={LibService.instance().getFieldLabel(props.pageConfig, name)}
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
            error={!!props.error}
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
