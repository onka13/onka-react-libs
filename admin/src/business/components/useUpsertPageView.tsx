import React, { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, GridSize, Tab, Tabs } from '@material-ui/core';
import { UIManager } from '../services/UIManager';
import { allInputs } from '../../ui/panel/components/form';
import { LibService } from '../services/LibService';
import { InputComponentProp } from '../../data/lib/InputComponentProp';
import { Parameters } from '../../data/lib/Types';
import { useForm } from '../helpers/UseForm';
import { LocaleService } from '../services/LocaleService';
import { UpsertPageViewProp } from '../../data/lib/UpsertPageViewProp';
import { PageField } from '../../data/lib/PageField';

class useUpsertPageViewResponse {
  UpsertPageView!: JSX.Element;
  setFormData!: (data: Parameters) => void;
  formData!: Parameters;
}

export function useUpsertPageView(props: UpsertPageViewProp): useUpsertPageViewResponse {
  const [tabIndex, setTabIndex] = useState(0);
  const { formData, setFormData, handleChange, handleChanges, handleSubmit, errors } = useForm({
    fields: (props.fields ? props.fields : props.tabs?.flatMap((x) => x.fields)) || [],
    initialValues: { ...props.initialValues, ...UIManager.instance().getDefaultValues() },
    onSubmit,
    onChange: props.onChange,
  });

  async function onSubmit() {
    props.onSubmit(formData);
  }

  function renderFields(fields: PageField[]) {
    var xs: GridSize = 6;
    return (
      <Grid container spacing={3}>
        {fields.map((field) => {
          // @ts-ignore
          xs = props.columnCount ? 12 / props.columnCount : field.fieldSize || 6;
          if (xs > 12 || xs < 1) xs = 6;
          var path = LibService.instance().getPath(field.prefix, field.name);
          var onChange = handleChange(path);
          if (field.reference) {
            var refPath = LibService.instance().getPath(field.prefix, field.reference.dataField);
            onChange = (value: any) => {
              handleChanges([
                { name: refPath, value },
                { name: path, value: value instanceof Array ? value?.map((x) => x.id) : value?.id },
              ]);
            };
          }
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
                  onChange: onChange,
                  error: LibService.instance().getValue(errors, path),
                  className: props.isEdit ? 'edit-field' : 'create-field',
                })
              )}
            </Grid>
          );
        })}
      </Grid>
    );
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  function UpsertPageView() : JSX.Element {
    return (
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
    );
  }

  return {
    UpsertPageView: <UpsertPageView />,
    setFormData,
    formData,
  };
}
