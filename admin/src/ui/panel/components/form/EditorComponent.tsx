import { TextField } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useFormHelper } from '../../../../business/helpers/UseForm';

export function EditorComponent(props: InputComponentProp) {
  const refEditor = useRef<any>();
  const formHelper = useFormHelper({
    formKey: props.formKey, 
    form: props.form,
    path: props.path,
    defaultValue: '',
  });
  
  const onReady = (editor: any) => {
    console.log('onReady');

    refEditor.current = editor;
    //refEditor.current.setData(props.rowData || '');
  };
  const onChange = (e: any, editor: any) => {
    const data = editor.getData();
  };
  const onBlur = (e: any, editor: any) => {
    props.form.handleChanges(props.formKey, [{ name: props.path, value: editor.getData() }]);
  };
  const onFocus = (e: any, editor: any) => {};

  useEffect(() => {
    if (!refEditor.current) {
      setTimeout(() => {
        refEditor.current && refEditor.current.setData(formHelper.value || '');
      }, 1000);
    }
  }, [formHelper.value]);

  if (props.isEdit && formHelper.value === undefined) return null;
  // console.log(
  //  'plugins',
  //  ClassicEditor.builtinPlugins.map((plugin: any) => plugin.pluginName)
  // );
  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
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
