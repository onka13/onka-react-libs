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

export function UpsertPage(props: UpsertPageProp) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let history = useHistory();
  const { id } = useParams<{ id: any }>();
  const isEdit = (id && id > 0) || !!props.isEdit;
  const [status, setStatus] = useState<PageStatus>('none');
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
    var record = await new ApiBusinessLogic().upsert(isEdit, pageConfig.route, formData);
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
    return fields.map((field) => {
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
        <div key={field.name} className={'col-lg-' + 12 / (props.columnCount || 2)}>
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
            })
          )}
        </div>
      );
    });
  }

  if (status == 'loading') return UIManager.instance().renderLoading();

  return (
    <form onSubmit={handleSubmit} className="form-validate">
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
                            <div className="row gy-4">{renderFields(tab.fields)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                <div className="card-inner">
                  <div className="row gy-4">{props.fields && renderFields(props.fields)}</div>
                </div>
              </div>

              <div className="col-12 pb20 mt10">
                <div className="form-group">
                  <button type="submit" className="btn btn-lg btn-primary">
                    {LocaleService.instance().translate(isEdit ? 'lib.action.edit' : 'lib.action.save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
