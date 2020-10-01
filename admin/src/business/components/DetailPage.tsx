import React, { useState, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { ApiBusinessLogic } from '../services/ApiBusinessLogic';
import { UIManager } from '../services/UIManager';
import { allInputs } from '../../ui/panel/components/form/index';
import { DetailComponentProp } from '../../data/lib/DetailComponentProp';
import { LibService } from '../services/LibService';
import { PageStatus } from '../../data/lib/Types';
import { LocaleService } from '../services/LocaleService';
import { PagePropBase } from '../../data/lib/PagePropBase';
import { PageField } from '../../data/lib/PageField';
import { Box, Button, Card, CardContent, CardHeader, Grid, GridSize, Tab, Tabs } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

export function DetailPage(props: PagePropBase) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let fields = props.fields;
  let history = useHistory();
  const [state, setState] = useState<{ [x: string]: any }>({});
  const [status, setStatus] = useState<PageStatus>('loading');
  const { id } = useParams<{ id: any }>();
  const [tabIndex, setTabIndex] = useState(0);

  function loadData() {
    setStatus('loading');
    new ApiBusinessLogic()
      .get(pageConfig.route, id)
      .then((response) => {
        setState(response.value);
        setStatus('done');
      })
      .catch((reason) => {
        UIManager.instance().gotoPage(history, 'list', pageConfig, { id, preserveQueryParams: true });
        throw reason;
      });
  }

  useEffect(() => {
    loadData();
    var refreshSubscription = LibService.instance().refreshPage.subscribe(() => {
      loadData();
    });
    return () => {
      refreshSubscription.unsubscribe();
    };
  }, []);

  function renderFields(fields: PageField[]) {
    var xs: GridSize = 6;
    // @ts-ignore
    xs = 12 / (props.columnCount || 2);
    if (xs > 12 || xs < 1) xs = 6;
    return (
      <Grid container spacing={3}>
        {fields.map((field, i) => {
          var path = LibService.instance().getPath(field.prefix, field.name);
          return (
            <Grid item key={field.name} xs={xs}>
              {React.createElement(
                field.detailComponent || allInputs.DetailFieldComponent,
                new DetailComponentProp({
                  key: field.name,
                  pageConfig,
                  fields,
                  field,
                  data: state,
                  rowData: LibService.instance().getValue(state, path),
                  className: 'detail-field'
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
    <div className="detail-container">
      <Card>
        <CardHeader>
          {!UIManager.instance().isHideActions() && pageConfig.edit && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={UIManager.instance().getLink('edit', pageConfig, { id, preserveQueryParams: true })}
              startIcon={<EditIcon />}
            >
              {LocaleService.instance().translate('lib.action.edit')}
            </Button>
          )}
        </CardHeader>
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
      </Card>
    </div>
  );
}
