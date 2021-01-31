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

export function UpsertPageView(props: UpsertPageViewProp) {
  const [tabIndex, setTabIndex] = useState(0);

  const onChange = (field: PageField, value: any) => {
    const path = LibService.instance().getPath(field.prefix, field.name);
    if (!field.reference) {
      props.handleChanges([{ name: path, value }]);
      return;
    }
    const refPath = LibService.instance().getPath(field.prefix, field.reference.dataField);
    props.handleChanges([
      { name: refPath, value },
      { name: path, value: value instanceof Array ? value?.map((x) => x.id) : value?.id },
    ]);
  };

  const FieldComponent = useCallback(
    (fieldCompProps: { fields: PageField[]; field: PageField }) => {
      const path = LibService.instance().getPath(fieldCompProps.field.prefix, fieldCompProps.field.name);

      const inputProps = new InputComponentProp({
        key: fieldCompProps.field.name,
        pageConfig: props.pageConfig,
        fields: fieldCompProps.fields,
        field: fieldCompProps.field,
        data: props.formData,
        rowData: LibService.instance().getValue(props.formData, path),
        isEdit: props.isEdit,
        onChange: (value: any) => onChange(fieldCompProps.field, value),
        error: LibService.instance().getValue(props.errors, path),
        className: props.isEdit ? 'edit-field' : 'create-field',
        handleChanges: props.handleChanges,
        formSubject: props.subject
      });

      if (props.isEdit && fieldCompProps.field.editComponent) return <fieldCompProps.field.editComponent {...inputProps} />;
      if (!props.isEdit && fieldCompProps.field.createComponent) return <fieldCompProps.field.createComponent {...inputProps} />;
      return <allInputs.InputComponent {...inputProps} />;
    },
    [props.pageConfig, props.errors]
  );

  const renderFields = useCallback(
    function (fields: PageField[]) {
      if (props.template) {
        var items: Parameters = {};
        fields.forEach((field) => {
          items[field.name] = <FieldComponent key={field.name} fields={fields} field={field} />;
        });
        return props.template(items);
      }
      var size: GridSize = 6;
      return (
        <Grid container spacing={3}>
          {fields.map((field) => {
            // @ts-ignore
            size = props.columnCount ? 12 / props.columnCount : field.fieldSize || 6;
            if (size > 12 || size < 1) size = 6;
            return (
              <Grid item key={field.name} md={size} xs={12}>
                <FieldComponent key={field.name} fields={fields} field={field} />
              </Grid>
            );
          })}
        </Grid>
      );
    },
    [props.columnCount]
  );

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className="upsert-container">
      <form onSubmit={props.handleSubmit}>
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            {props.tabs && (
              <Tabs value={tabIndex} onChange={handleTabChange} aria-label="tabs">
                {props.tabs.map((tab, i) => {
                  return (
                    <Tab key={i} icon={tab.icon} label={LocaleService.instance().translate(tab.label, tab.label)} id={`tab-${i}`} aria-controls={`tab-${i}`} />
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
              {LocaleService.instance().translate('lib.action.save')}
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
}
