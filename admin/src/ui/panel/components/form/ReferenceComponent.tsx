import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TextField, CircularProgress, Checkbox, FormControl, FormControlLabel, FormHelperText, Paper, Button, Popper, ButtonGroup } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Autocomplete, AutocompleteChangeReason, AutocompleteRenderGroupParams } from '@material-ui/lab';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { ApiSearchRequest } from '../../../../data/api/ApiRequest';
import { LibService } from '../../../../business/services/LibService';
import { ApiBusinessLogic } from '../../../../business/services/ApiBusinessLogic';

export function MultiReferenceComponent(props: InputComponentProp) {
  return <ReferenceComponentBase isMultiple={true} props={props} />;
}
export function ReferenceComponent(props: InputComponentProp) {
  return <ReferenceComponentBase isMultiple={false} props={props} />;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function ReferenceComponentBase({ isMultiple, props }: { isMultiple: boolean; props: InputComponentProp }) {
  const [options, setOptions] = useState<any>([]);
  const [loading, setLoading] = useState(() => {
    return false;
  });
  const timer = useRef<number>(-1);
  const request = useRef<ApiSearchRequest>();

  const dependField = (props.field.depends?.length > 0 ? props.field.depends.map((x) => x.field)[0] : null) || null;

  const getValueByData = () => {
    return (props.data ? props.data[props.field.reference.dataField] : null) || (isMultiple ? [] : {});
  };
  const [value, setValue] = useState<any>(() => getValueByData());
  const getOptionLabel = (option: any) => {
    return (option ? option[props.field.reference.filterField] : null) || '';
  };
  const [inputValue, setInputValue] = useState(isMultiple ? '' : getOptionLabel(value));

  useEffect(() => {
    if (!dependField) return;
    timer.current = -1;
    if (!props.data[dependField]) setInputValue('');
    else if (props.data[dependField] != request.current?.filter[dependField]) setInputValue('');
    // @ts-ignore
  }, [props.data[dependField]]);

  useEffect(() => {
    if (!props.rowData) {
      setInputValue('');
      timer.current = -1;
      return;
    }
    setValue(getValueByData());
    setInputValue(getOptionLabel(getValueByData()));
    if (isMultiple && props.isFilter) setValueEmpty(props.data ? props.data[props.field.name + 'Empty'] : false);
  }, [props.rowData]);

  const makeRequest = (term: String) => {
    if (timer.current) clearTimeout(timer.current);
    const reference = props.field.reference;
    timer.current = window.setTimeout(() => {
      setLoading(true);
      var req = new ApiSearchRequest();
      req.pagination.page = 1;
      req.pagination.perPage = reference.limit !== undefined ? reference.limit : 20;
      req.sort.field = reference.sortField || 'id';
      req.sort.order = reference.sortDirection || 'ASC';
      req.filter[reference.filterField] = term;
      if (props.field.depends) {
        for (let i = 0; i < props.field.depends.length; i++) {
          const depend = props.field.depends[i];
          req.filter[depend.name] = depend.field ? props.data[depend.field] : depend.value;
        }
      }
      request.current = req;
      new ApiBusinessLogic()
        .search(reference.route, req)
        .then((response) => {
          setOptions(response.value);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  };
  const onChange = (e: any, newValue: any, reason: AutocompleteChangeReason) => {
    setValue(newValue);
    props.onChange(newValue);
    if (!isMultiple && reason == 'select-option') {
      setInputValue(getOptionLabel(newValue));
      timer.current = -1;
    }
    for (let i = 0; i < props.fields.length; i++) {
      const element = props.fields[i];
      var depend = element.depends?.filter((x) => x.field == props.field.name);
      if (depend && depend.length > 0) {
        props.handleChanges([
          { name: element.name, value: null },
          { name: element.reference?.dataField, value: null },
        ]);
      }
    }
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
    if (reason !== 'reset') {
      setInputValue(value);
    }
  };
  const [valueEmpty, setValueEmpty] = useState(false);
  const handleChangeEmpty = (e: any) => {
    setValueEmpty(e.target.checked);
    const { reference, ...rest } = props.field;
    props.handleChanges([{ name: props.field.name + 'Empty', value: e.target.checked }]);
  };
  const addAllClick = (e: any) => {
    props.onChange(options);
  };
  const clearClick = (e: any) => {
    props.onChange([]);
  };
  const MyPopper = function (popperProps: any) {
    if (props.field.reference.limit !== 0) {
      return <Popper {...popperProps} />;
    }
    return (
      <Popper {...popperProps}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button color="primary" onClick={addAllClick}>
            Add All
          </Button>
          <Button color="primary" onClick={clearClick}>
            Clear
          </Button>
        </ButtonGroup>
        {popperProps.children}
      </Popper>
    );
  };
  return (
    <div style={{ display: 'inline-flex' }}>
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
        onChange={onChange}
        onOpen={onOpen}
        filterOptions={(options: any, state: object) => options}
        className={props.className}
        fullWidth
        inputValue={inputValue}
        onInputChange={onInputChange}
        disabled={(!!dependField && !props.data[dependField]) || !!valueEmpty}
        PopperComponent={MyPopper}
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
      {isMultiple && props.isFilter && (
        <FormControl>
          <FormControlLabel
            id={props.field.name + 'empty'}
            label={'Empty ' + LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
            control={<Checkbox checked={valueEmpty} onChange={handleChangeEmpty} name={props.field.name + 'Empty'} />}
          />
        </FormControl>
      )}
    </div>
  );
}
