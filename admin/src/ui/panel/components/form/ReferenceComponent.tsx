import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  TextField,
  CircularProgress,
  Checkbox,
  FormControl,
  FormControlLabel,
  Button,
  Popper,
  ButtonGroup,
  ListSubheader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  makeStyles,
  Box,
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Autocomplete, AutocompleteChangeReason, AutocompleteRenderGroupParams } from '@material-ui/lab';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { ApiSearchRequest } from '../../../../data/api/ApiRequest';
import { LibService } from '../../../../business/services/LibService';
import { ApiBusinessLogic } from '../../../../business/services/ApiBusinessLogic';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import lodash from 'lodash';

const useStyles = makeStyles({
  accordionExpanded: {
    margin: '0 !important',
  },
  accordionSummaryRoot: {
    backgroundColor: '#efefef',
  },
  accordionSummaryContent: {
    margin: '0 !important',
  },
});

export function MultiReferenceComponent(props: InputComponentProp) {
  return <ReferenceComponentBase isMultiple={true} props={props} />;
}
export function ReferenceComponent(props: InputComponentProp) {
  return <ReferenceComponentBase isMultiple={false} props={props} />;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function ReferenceComponentBase({ isMultiple, props }: { isMultiple: boolean; props: InputComponentProp }) {
  const classes = useStyles();
  const [options, setOptions] = useState<any>([]);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(() => {
    return false;
  });
  const [error, setError] = useState('');
  const timer = useRef<number>(-1);
  const request = useRef<ApiSearchRequest>();
  const [valueEmpty, setValueEmpty] = useState(false);

  const dependField = (props.field.depends?.length > 0 ? props.field.depends.map((x) => x.field)[0] : null) || null;

  const reference = props.field.reference;
  const treeParentFieldId = reference.treeParentFieldId || '';

  const getValueByData = () => {
    const data = props.form.getFormData();
    return (data ? data[props.field.reference.dataField] : null) || (isMultiple ? [] : {});
  };
  const [value, setValue] = useState<any>(isMultiple ? [] : {});
  const getOptionLabel = (option: any) => {
    return (option ? option[props.field.reference.filterField] : null) || '';
  };
  const [inputValue, setInputValue] = useState(isMultiple ? '' : getOptionLabel(value));

  const handleChanges = (values: any) => {
    var refPath = LibService.instance().getPath(props.field.prefix, props.field.reference.dataField);
    props.form.handleChanges([
      { name: refPath, value: values },
      { name: props.path, value: values instanceof Array ? values?.map((x) => x.id) : values?.id },
    ]);
  };

  useEffect(() => {
    var subscription = props.form.subscribe((data) => {      
      const rowData = props.form.getValue(props.path);
      console.log('Reference observer', props.field.name, rowData);
      setDisabled((!!dependField && !props.form.getFormData()[dependField]) || !!valueEmpty);
      if (!rowData) {
        console.log('Reference observer1', props.field.name);
        setInputValue('');
        timer.current = -1;
        return;
      }

      console.log('Reference observer4', props.field.name);
      setValue(getValueByData());
      if (isMultiple && props.isFilter) setValueEmpty(data ? data[props.field.name + 'Empty'] : false);

      if (data && dependField) {         
        if (!data[dependField]) {
          console.log('Reference observer2', props.field.name);
          setInputValue('');
          return;
        } else if (data[dependField] != request.current?.filter[dependField]) {
          console.log('Reference observer3', props.field.name);
          setInputValue('');
          return;
        }
      }
      
      setInputValue(getOptionLabel(getValueByData()));
    });
    var subscriptionError = props.form.subscribeError((data) => {
      const rowData = props.form.getError(props.path);
      setError(rowData || '');
    });
    return () => {
      props.form.unsubscribe(subscription);
      props.form.unsubscribeError(subscriptionError);
    };
  }, []);

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
          req.filter[depend.name] = depend.field ? props.form.getFormData()[depend.field] : depend.value;
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
    handleChanges(newValue);
    if (!isMultiple && reason == 'select-option') {
      setInputValue(getOptionLabel(newValue));
      timer.current = -1;
    }
    for (let i = 0; i < props.fields.length; i++) {
      const element = props.fields[i];
      var depend = element.depends?.filter((x) => x.field == props.field.name);
      if (depend && depend.length > 0) {
        props.form.handleChanges([
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
  
  const handleChangeEmpty = (e: any) => {
    setValueEmpty(e.target.checked);
    const { reference, ...rest } = props.field;
    props.form.handleChanges([{ name: props.field.name + 'Empty', value: e.target.checked }]);
  };

  const MyPopper = useCallback(
    function (popperProps: any) {
      //console.log('popperProps', popperProps);
      if (!props.field.reference.addAllButton) {
        return <Popper {...popperProps} />;
      }
      return (
        <Popper {...popperProps}>
          <ButtonGroup color="primary" aria-label="contained primary button group" style={{ backgroundColor: '#fff' }}>
            <Button
              color="primary"
              onClick={(e) => {
                handleChanges(options);
              }}
            >
              Add All
            </Button>
          </ButtonGroup>
          {popperProps.children}
        </Popper>
      );
    },
    [options]
  );
  const addAllSubItems = useCallback(
    (parentId: any, isChecked: boolean) => {
      var subItems = options.filter((x: any) => x[treeParentFieldId] == parentId);
      var newValue = isChecked ? [...value, ...subItems] : value.filter((x: any) => subItems.filter((y: any) => y.id == x.id).length == 0);
      handleChanges(newValue);
    },
    [value, options]
  );
  const renderGroup = useCallback(
    function (params: AutocompleteRenderGroupParams) {
      //console.log('renderGroup', params.group, params.children);
      if (!params.group) return null;
      const item = options[parseInt(params.key)];
      const children = params.children instanceof Array && params.children ? params.children : [];
      var isSelected = children.length > 0;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        // @ts-ignore
        if (!child.props['aria-selected']) {
          isSelected = false;
          break;
        }
      }
      return (
        <Accordion
          key={params.key}
          defaultExpanded={true}
          classes={{
            expanded: classes.accordionExpanded,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            classes={{
              expanded: classes.accordionExpanded,
              content: classes.accordionSummaryContent,
              root: classes.accordionSummaryRoot,
            }}
          >
            <Checkbox
              onClick={(e: any) => {
                e.stopPropagation();
                if (typeof e.target.checked != 'boolean') return;
                addAllSubItems(item[treeParentFieldId], e.target.checked);
              }}
              onFocus={(event) => event.stopPropagation()}
              checked={isSelected}
            />
            {lodash.get(item, reference.treeParentFieldName || 'name')}
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            <List style={{ padding: 0, width: '100%' }}>{params.children}</List>
          </AccordionDetails>
        </Accordion>
      );
      /*return [
      <ListSubheader key={params.key} component="div" style={{ backgroundColor: '#efefef' }}>
        {params.group}
      </ListSubheader>,
      params.children,
    ];*/
    },
    [options, value]
  );
  const groupBy = () => {
    if (!treeParentFieldId) return;
    return (option: any) => {
      return option[treeParentFieldId];
      //return option[treeParentFieldId] ? option[treeParentFieldId] : 'no-parent';
    };
  };

  console.log('Reference render', props.field.name);

  return (
    <div
      style={
        {
          /*display: 'inline-flex'*/
        }
      }
    >
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
        disabled={disabled}
        PopperComponent={MyPopper}
        groupBy={groupBy()}
        disableListWrap
        renderGroup={renderGroup}
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
              error={!!error}
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
