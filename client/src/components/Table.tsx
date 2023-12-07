import React from 'react';
import MaterialTable, { Column } from '@material-table/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

interface RowData {
  id: number;
  name: string;
  age: number;
  email: string;
}

interface MyMaterialTableProps {
  data: RowData[];
  columns: Column<RowData>[];
}

const Table: React.FC<MyMaterialTableProps> = ({ data, columns }) => {
  const darkTheme = createTheme({
    palette: {
      type: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <MaterialTable
        title="User Data"
        columns={columns}
        data={data}
        options={{
          sorting: true,
          paging: true,
          filtering: true,
        }}
        localization={{
          body: {
            emptyDataSourceMessage: 'No records to display',
          },
          toolbar: {
            searchTooltip: 'Search',
            searchPlaceholder: 'Search',
          },
          pagination: {
            labelRows: 'rows per page',
            labelDisplayedRows: '{from}-{to} of {count}',
            firstTooltip: 'First Page',
            previousTooltip: 'Previous Page',
            nextTooltip: 'Next Page',
            lastTooltip: 'Last Page',
          },
        }}
      />
    </ThemeProvider>
  );
};

export default Table;
