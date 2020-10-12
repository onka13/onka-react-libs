## Field Components

- GridFieldComponent

### Custom Grid Component

```
export function GridFieldComponent(props: GridComponentProp) {
  const field = props.gridField;
  var path = LibService.instance().getPath(field.prefix, field.name);
  var val = LibService.instance().getValue(props.rowData, path);
  return <span>{val}</span>;
}

```