import React from 'react';
// import MaterialTable, { Column } from '@material-table/core';
// import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useMemo } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';



interface RowData {
  id: number;
  name: string;
  age: number;
  email: string;
}

interface MyMaterialTableProps {
  data: RowData[];
  columns: MRT_ColumnDef<RowData>[];
}

const Table: React.FC<MyMaterialTableProps> = ({ data, columns }) => {

  const table = useMantineReactTable({
    columns,
    data,
  });

  return <MantineReactTable table={table} />;
};

export default Table;
