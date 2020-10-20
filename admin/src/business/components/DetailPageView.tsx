import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Grid, GridSize, Tab, Tabs } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { UIManager } from '../services/UIManager';
import { allInputs } from '../../ui/panel/components/form/index';
import { DetailComponentProp } from '../../data/lib/DetailComponentProp';
import { LibService } from '../services/LibService';
import { LocaleService } from '../services/LocaleService';
import { PageField } from '../../data/lib/PageField';
import { PageViewProp } from '../../data/lib/PageViewProp';

export function DetailPageView(props: PageViewProp) {
  const { id } = useParams<{ id: any }>();
  const [tabIndex, setTabIndex] = useState(0);

  function renderFields(fields: PageField[]) {
    var xs: GridSize = 6;
    return (
      <Grid container spacing={3}>
        {fields.map((field, i) => {
          // @ts-ignore
          xs = props.columnCount ? 12 / props.columnCount : field.fieldSize || 6;
          if (xs > 12 || xs < 1) xs = 6;
          var path = LibService.instance().getPath(field.prefix, field.name);
          return (
            <Grid item key={field.name} xs={xs}>
              {React.createElement(
                field.detailComponent || allInputs.DetailFieldComponent,
                new DetailComponentProp({
                  key: field.name,
                  pageConfig: props.pageConfig,
                  fields,
                  field,
                  data: props.data,
                  rowData: LibService.instance().getValue(props.data, path),
                  className: 'detail-field',
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
        <CardActions>
          {!UIManager.instance().isHideActions() && props.pageConfig.edit && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={UIManager.instance().getLink('edit', props.pageConfig, { id, preserveQueryParams: true })}
              startIcon={<EditIcon />}
            >
              {LocaleService.instance().translate('lib.action.edit')}
            </Button>
          )}
        </CardActions>
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
