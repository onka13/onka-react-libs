import React, { useCallback, useEffect, useState } from 'react';
import { LibService } from '../../../../business/services/LibService';

// export function FilterComponent(props: FilterComponentProp) {
//   const handleChange = useCallback((e: any) => {
//     props.onChange(e.target.value);
//   }, []);
//   const [value, setValue] = useState('');
//   useEffect(() => {
//     setValue(props.rowData || '');
//   }, [props.rowData]);
//   return (
//     <TextField
//       id={props.filterField.filterName}
//       label={LibService.instance().getFieldLabel(props.pageConfig, props.filterField.filterName)}
//       defaultValue={props.rowData || ''}
//       onChange={handleChange}
//       value={value}
//     />
//   );
// }
