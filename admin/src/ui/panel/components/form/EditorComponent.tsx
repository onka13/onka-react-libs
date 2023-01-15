import React, { useCallback, useEffect, useRef, useState } from 'react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { useFormHelper } from '../../../../business/helpers/UseForm';

export function EditorComponent(props: InputComponentProp) {
  const refEditor = useRef<any>();
  const formHelper = useFormHelper({
    formKey: props.formKey,
    form: props.form,
    path: props.path,
    defaultValue: '',
  });
  const [error, setError] = useState('');

  const onReady = (editor: any) => {
    refEditor.current = editor;
  };
  const onChange = (e: any, editor: any) => {
    const data = editor.getData();
  };
  const onBlur = (e: any, editor: any) => {
    props.form.handleChanges(props.formKey, [{ name: props.path, value: editor.getData() }]);
  };
  const onFocus = (e: any, editor: any) => {};

  useEffect(() => {
    var subscription = props.form.subscribe(props.formKey, (data) => {
      const rowData = props.form.getValue(props.formKey, props.path);
      refEditor.current && refEditor.current.setData(rowData || '');
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

  if (props.isEdit && formHelper.value === undefined) return null;
  // console.log(
  //  'plugins',
  //  ClassicEditor.builtinPlugins.map((plugin: any) => plugin.pluginName)
  // );
  return (
    <div>
      <CKEditor
        editor={Editor}
        config={{
          removePlugins: ['ImageCaption', 'EasyImage', 'MediaEmbed', 'ImageToolbar', 'CKFinder', 'ImageUpload'],
        }}
        onReady={onReady}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </div>
  );
}
