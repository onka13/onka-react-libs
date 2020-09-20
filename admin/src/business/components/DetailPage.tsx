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

export function DetailPage(props: PagePropBase) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let fields = props.fields;
  let history = useHistory();
  const [state, setState] = useState<{ [x: string]: any }>({});
  const [status, setStatus] = useState<PageStatus>('loading');
  const { id } = useParams<{ id: any }>();

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
    return fields.map((field, i) => {
      var path = LibService.instance().getPath(field.prefix, field.name);
      return React.createElement(
        field.detailComponent || allInputs.DetailFieldComponent,
        new DetailComponentProp({
          key: field.name,
          pageConfig,
          fields,
          field,
          data: state,
          rowData: LibService.instance().getValue(state, path),
        })
      );
    });
  }

  if (status == 'loading') return UIManager.instance().renderLoading();

  return (
    <React.Fragment>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between g-3">
          <div className="nk-block-head-content"></div>
          {!UIManager.instance().isHideActions() && (
            <div className="nk-block-head-content">
              {pageConfig.edit && (
                <Link
                  to={UIManager.instance().getLink('edit', pageConfig, { id, preserveQueryParams: true })}
                  className="btn btn-outline-light bg-white d-none d-sm-inline-flex"
                >
                  <em className="icon ni ni-edit"></em>
                  <span>{LocaleService.instance().translate('lib.action.edit')}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="nk-block">
        <div className="card card-bordered">
          <div className="card-aside-wrap">
            <div className="card-content">
              <ul className="nav nav-tabs nav-tabs-mb-icon nav-tabs-card">
                {props.tabs &&
                  props.tabs.map((tab, i) => {
                    return (
                      <li key={i} className="nav-item">
                        <a className={'nav-link ' + (i == 0 && 'active')} href={'#t' + i} data-toggle="tab">
                          <em className={'icon ni ' + tab.icon}></em>
                          <span>{LocaleService.instance().translate(tab.label, tab.label)}</span>
                        </a>
                      </li>
                    );
                  })}
              </ul>
              <div className="tab-content">
                {props.tabs &&
                  props.tabs.map((tab, i) => {
                    return (
                      <div key={i} className={'tab-pane ' + (i == 0 && 'active')} id={'t' + i}>
                        <div className="card-inner">
                          <div className="nk-block">
                            <div className="row">{renderFields(tab.fields)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {fields && (
                  <div className="tab-pane active">
                    <div className="card-inner">
                      <div className="nk-block">
                        <div className="row">{renderFields(fields)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
