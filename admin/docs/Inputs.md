## Input Components

- FilterComponent
- InputComponent
- CheckboxComponent
- DateComponent
- TextareaComponent
- SelectComponent
- NumberComponent

### Custom Component

```
export function MyInputComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.onChange(e.target.value);
  };
  return (
    <TextField
      id={props.field.name}
      label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      defaultValue={props.rowData || ''}
      error={!!props.error}
      helperText={props.error}
      onChange={handleChange}
      type="number"
      fullWidth
    />
  );
}
```