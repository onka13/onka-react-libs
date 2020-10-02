import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ApiBusinessLogic } from '../services/ApiBusinessLogic';
import { UIManager } from '../services/UIManager';
import { allInputs } from '../../ui/panel/components/form';
import { LibService } from '../services/LibService';
import { InputComponentProp } from '../../data/lib/InputComponentProp';
import { PageStatus } from '../../data/lib/Types';
import { useForm } from '../helpers/UseForm';
import { LocaleService } from '../services/LocaleService';
import { UpsertPageProp } from '../../data/lib/UpsertPageProp';
import { PageField } from '../../data/lib/PageField';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, GridSize, Tab, Tabs } from '@material-ui/core';

export function UpsertPage(props: UpsertPageProp) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let history = useHistory();
  const { id } = useParams<{ id: any }>();
  const isEdit = (id && id > 0) || !!props.isEdit;
  const [status, setStatus] = useState<PageStatus>('none');
  const [tabIndex, setTabIndex] = useState(0);
  const { formData, setFormData, handleChange, handleChanges, handleSubmit, errors } = useForm({
    fields: (props.fields ? props.fields : props.tabs?.flatMap((x) => x.fields)) || [],
    initialValues: { ...props.initialValues, ...UIManager.instance().getDefaultValues() },
    onSubmit,
  });

  function loadData() {
    setStatus('loading');
    (props.loadData ? props.loadData() : new ApiBusinessLogic().get(pageConfig.route, id))
      .then((response) => {
        setFormData(response.value);
        setStatus('done');
      })
      .catch((reason) => {
        setStatus('none');
        UIManager.instance().gotoPage(history, 'list', pageConfig, { id, preserveQueryParams: true });
        throw reason;
      });
  }

  async function onSubmit() {
    if (props.onSubmit) {
      props.onSubmit(formData);
      return;
    }
    UIManager.instance().displayLoading(true);
    var record = await new ApiBusinessLogic().upsert(isEdit, pageConfig.route, formData);
    UIManager.instance().displayLoading(false);
    var redirect = UIManager.instance().getRedirect() || 'list';
    UIManager.instance().gotoPage(history, redirect, pageConfig, {
      id: record.value?.id,
      preserveQueryParams: true,
    });
  }

  useEffect(() => {
    if (isEdit) {
      loadData();
      var refreshSubscription = LibService.instance().refreshPage.subscribe(() => {
        loadData();
      });
      return () => {
        refreshSubscription.unsubscribe();
      };
    }
  }, []);

  function renderFields(fields: PageField[]) {
    var xs: GridSize = 6;
    // @ts-ignore
    xs = 12 / (props.columnCount || 2);
    if (xs > 12 || xs < 1) xs = 6;
    return (
      <Grid container spacing={3}>
        {fields.map((field) => {
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
                (isEdit ? field.editComponent : field.createComponent) || allInputs.InputComponent,
                new InputComponentProp({
                  key: field.name,
                  pageConfig,
                  fields,
                  field,
                  data: formData,
                  rowData: LibService.instance().getValue(formData, path),
                  isEdit: isEdit,
                  onChange: onChange,
                  error: LibService.instance().getValue(errors, path),
                  className: isEdit ? 'edit-field' : 'create-field'
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

  if (status == 'loading') return UIManager.instance().renderLoading();

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
              {LocaleService.instance().translate(isEdit ? 'lib.action.edit' : 'lib.action.save')}
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
}
