import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, GridSize, Tab, Tabs } from '@material-ui/core';
import { UIManager } from '../services/UIManager';
import { allInputs } from '../../ui/panel/components/form';
import { LibService } from '../services/LibService';
import { InputComponentProp } from '../../data/lib/InputComponentProp';
import { Parameters } from '../../data/lib/Types';
import { HandleChangeType, useForm } from '../helpers/UseForm';
import { LocaleService } from '../services/LocaleService';
import { UpsertPageViewProp } from '../../data/lib/UpsertPageViewProp';
import { PageField } from '../../data/lib/PageField';
import { useFormValidator } from '../helpers/UseFormValidator';

class useUpsertPageViewResponse {
  UpsertPageView!: JSX.Element;
  updateFormData!: (data: Parameters) => void;
  formData!: Parameters;
}

export function useUpsertPageView(props: UpsertPageViewProp): useUpsertPageViewResponse {
  const [tabIndex, setTabIndex] = useState(0);
  /*const { formData, updateFormData, handleChange, handleChanges, handleSubmit, errors } = useForm({
    fields: (props.fields ? props.fields : props.tabs?.flatMap((x) => x.fields)) || [],
    initialValues: { ...props.initialValues, ...UIManager.instance().getDefaultValues() },
    onSubmit: props.onSubmit,
    onChange: props.onChange,
  });*/

  const [formData, setFormData] = useState<Parameters>(() => {
    return props.initialValues;
  });
  const refFormData = useRef<Parameters>();
  const refErrors = useRef<Parameters>();

  const [errors, setErrors] = useState<Parameters>({});
  const { validate } = useFormValidator({});

  const handleSubmit = useCallback(
    function (e: any) {
      e.preventDefault();
      var fields = (props.fields ? props.fields : props.tabs?.flatMap((x) => x.fields)) || [];
      var errorList = validate(fields, formData);
      if (errorList) {
        refErrors.current = errorList;
        setErrors(errorList);
        return;
      }
      props.onSubmit(formData);
    },
    [formData]
  );

  const updateFormData = useCallback(function (data: Parameters) {
    setFormData(data);
    props.onChange && props.onChange(data);
  }, []);

  const handleChanges = useCallback(
    (values: HandleChangeType[]) => {
      var dataCloned = { ...refFormData.current };
      for (let i = 0; i < values.length; i++) {
        const item = values[i];
        LibService.instance().setValue(dataCloned, item.name, item.value);
      }
      refFormData.current = dataCloned;
      setFormData(dataCloned);
    },
    [formData]
  );

  const handleChange = (name: string) => (value: any) => {
    handleChanges([{ name, value }]);
  };

  const onChange = useCallback((field: PageField, value: any) => {
    const path = LibService.instance().getPath(field.prefix, field.name);
    if (!field.reference) {
      handleChange(path)(value);
      return;
    }
    const refPath = LibService.instance().getPath(field.prefix, field.reference.dataField);
    handleChanges([
      { name: refPath, value },
      { name: path, value: value instanceof Array ? value?.map((x) => x.id) : value?.id },
    ]);
  }, []);

  const renderFields = useCallback(
    function (fields: PageField[]) {
      var xs: GridSize = 6;
      return (
        <Grid container spacing={3}>
          {fields.map((field) => {
            // @ts-ignore
            xs = props.columnCount ? 12 / props.columnCount : field.fieldSize || 6;
            if (xs > 12 || xs < 1) xs = 6;
            const path = LibService.instance().getPath(field.prefix, field.name);
            return (
              <Grid item key={field.name} xs={xs}>
                {React.createElement(
                  (props.isEdit ? field.editComponent : field.createComponent) || allInputs.InputComponent,
                  new InputComponentProp({
                    key: field.name,
                    pageConfig: props.pageConfig,
                    fields,
                    field,
                    data: formData,
                    rowData: LibService.instance().getValue(formData, path),
                    isEdit: props.isEdit,
                    onChange: (value: any) => onChange(field, value),
                    error: LibService.instance().getValue(refErrors.current, path),
                    className: props.isEdit ? 'edit-field' : 'create-field',
                  })
                )}
              </Grid>
            );
          })}
        </Grid>
      );
    },
    [formData]
  );

  const handleTabChange = useCallback((event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  }, []);

  return {
    formData,
    updateFormData,
    UpsertPageView: (
      <div className="upsert-container">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader></CardHeader>
            <CardContent>
              {props.tabs && (
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="tabs">
                  {props.tabs.map((tab, i) => {
                    return (
                      <Tab
                        key={i}
                        icon={tab.icon}
                        label={LocaleService.instance().translate(tab.label, tab.label)}
                        id={`tab-${i}`}
                        aria-controls={`tab-${i}`}
                      />
                    );
                  })}
                </Tabs>
              )}
              {props.tabs &&
                props.tabs.map((tab, i) => {
                  return (
                    <div key={i} role="tabpanel" hidden={tabIndex !== i} id={`tabpanel-${i}`} aria-labelledby={`tab-${i}`}>
                      <Box p={3}>{renderFields(tab.fields)}</Box>
                    </div>
                  );
                })}
              {props.fields && renderFields(props.fields)}
            </CardContent>
            <CardActions>
              <Button type="submit" variant="contained" color="primary">
                {LocaleService.instance().translate(props.isEdit ? 'lib.action.edit' : 'lib.action.save')}
              </Button>
            </CardActions>
          </Card>
        </form>
      </div>
    ),
  };
}
