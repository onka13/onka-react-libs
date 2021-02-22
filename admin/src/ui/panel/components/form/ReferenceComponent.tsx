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
  const refDepend = useRef<any>();
  const [valueEmpty, setValueEmpty] = useState(false);

  const dependField = (props.field.depends?.length > 0 ? props.field.depends.map((x) => x.field)[0] : null) || null;

  const reference = props.field.reference;
  const treeParentFieldId = reference.treeParentFieldId || '';

  const getValueByData = () => {
    const data = props.form.getFormData(props.formKey);
    return (data ? data[props.field.reference.dataField] : null) || (isMultiple ? [] : {});
  };
  const [value, setValue] = useState<any>(isMultiple ? [] : {});
  const getOptionLabel = (option: any) => {
    return (option ? option[props.field.reference.filterField] : null) || '';
  };
  const [inputValue, setInputValue] = useState(isMultiple ? '' : getOptionLabel(value));

  const handleChanges = (values: any) => {
    var refPath = LibService.instance().getPath(props.field.prefix, props.field.reference.dataField);
    props.form.handleChanges(props.formKey, [
      { name: refPath, value: values },
      { name: props.path, value: values instanceof Array ? values?.map((x) => x.id) : values?.id },
    ]);
  };

  useEffect(() => {
    var subscription = props.form.subscribe(props.formKey, (data) => {      
      const rowData = props.form.getValue(props.formKey, props.path);
      console.log('Reference subscribe', props.field.name, rowData, data);
      setDisabled((!!dependField && !props.form.getFormData(props.formKey)[dependField]) || !!valueEmpty);
      if (!rowData) {
        setInputValue('');
        timer.current = -1;
        return;
      }

      setValue(getValueByData());
      if (isMultiple && props.isFilter) setValueEmpty(data ? data[props.field.name + 'Empty'] : false);

      if (data && dependField) {
        var dependIsChanged = data[dependField] != refDepend.current;
        refDepend.current = data[dependField];
        if (!data[dependField] || dependIsChanged) {
          setInputValue('');
          return;
        }
      }

      setInputValue(getOptionLabel(getValueByData()));
    });
    var subscriptionError = props.form.subscribeError(props.formKey, (data) => {
      const rowData = props.form.getError(props.formKey, props.path);
      setError(rowData || '');
    });
    props.form.initInitialValues(props.formKey);
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
          req.filter[depend.name] = depend.field ? props.form.getFormData(props.formKey)[depend.field] : depend.value;
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
        props.form.handleChanges(props.formKey, [
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
    props.form.handleChanges(props.formKey, [{ name: props.field.name + 'Empty', value: e.target.checked }]);
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
                addAllItems();
              }}
            >
              Add All
            </Button>
          </ButtonGroup>
          {popperProps.children}
        </Popper>
      );
    },
    [value, options]
  );

  const addAllSubItems = useCallback(
    (item: any, isChecked: boolean) => {
      var subItems = options.filter(
        (x: any) => x[treeParentFieldId] == item[treeParentFieldId] || (reference.parentIsAddable && x.id == item[treeParentFieldId])
      );
      var newValue = isChecked ? [...value, ...subItems] : value.filter((x: any) => subItems.filter((y: any) => y.id == x.id).length == 0);
      handleChanges(newValue);
    },
    [value, options]
  );

  const addAllItems = useCallback(() => {
    if (reference.parentIsAddable) {
      handleChanges(options);
      return;
    }
    const allItems = options.filter((option: any) => {
      if (option[treeParentFieldId]) return true;
      var hasSubItems = options.some((x: any) => x[treeParentFieldId] == option.id);
      if (hasSubItems) return false;
      return true;
    });
    handleChanges(allItems);
  }, [value, options]);

  const renderGroup = useCallback(
    function (params: AutocompleteRenderGroupParams) {
      //console.log('renderGroup', params.key, params.group, params.children);
      if (!params.group) return null;
      const item = options[parseInt(params.key)];
      if (params.group == 'no-parent') {
        return (
          <List key={item.id} style={{ padding: 0, width: '100%' }}>
            {params.children}
          </List>
        );
      }

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
          key={item.id + params.key}
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
                addAllSubItems(item, e.target.checked);
              }}
              onFocus={(event) => event.stopPropagation()}
              checked={isSelected}
            />
            <div style={{ marginTop: 9 }}>{lodash.get(item, reference.treeParentFieldName || 'name')}</div>
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
      //return option[treeParentFieldId];
      if (option[treeParentFieldId]) return option[treeParentFieldId];
      if (!reference.displayParentWithNoChild) return undefined;
      var hasSubItems = options.some((x: any) => x[treeParentFieldId] == option.id);
      if (hasSubItems) return undefined;
      return 'no-parent';
    };
  };

  console.log('Reference render', props.field.name, value, options);

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
