import { TextField } from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export function EditorComponent(props: InputComponentProp) {
  const refEditor = useRef<any>();
  const [value, setValue] = useState('');
  const onReady = (editor: any) => {
    console.log('onReady');

    refEditor.current = editor;
  };
  const onChange = (e: any, editor: any) => {
    const data = editor.getData();
  };
  const onBlur = (e: any, editor: any) => {
    props.onChange(editor.getData());
  };
  const onFocus = (e: any, editor: any) => {};

  useEffect(() => {
    if (!refEditor.current) {
      setTimeout(() => {
        refEditor.current && refEditor.current.setData(props.rowData || '');
      }, 1000);
    }
  }, [props.rowData]);
  if (props.rowData === undefined) return null;
  //console.log(
  //  'plugins',
  //  ClassicEditor.builtinPlugins.map((plugin: any) => plugin.pluginName)
  //);
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
