// TableComponent.tsx
import React, { useMemo } from 'react';
import { useTable, useSortBy, usePagination, useFilters, Column } from 'react-table';

interface TableProps {
  data: any[];
  columns: Column[];
}

const Table: React.FC<TableProps> = ({ data, columns }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize, sortBy, filters },
    setPageSize,
    gotoPage,
    setFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Initial state
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilter(columnId, value);
  };

  return (
    <div>
      <div>
        <label>
          Page Size:{' '}
          <select value={pageSize} onChange={handlePageSizeChange}>
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <table {...getTableProps()} style={{ width: '100%' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => gotoPage(0)} disabled={pageIndex === 0}>
          {'<<'}
        </button>{' '}
        <button onClick={() => gotoPage(pageIndex - 1)} disabled={pageIndex === 0}>
          {'<'}
        </button>{' '}
        <button onClick={() => gotoPage(pageIndex + 1)} disabled={pageIndex === page.length - 1}>
          {'>'}
        </button>{' '}
        <button
          onClick={() => gotoPage(page.length - 1)}
          disabled={pageIndex === page.length - 1}
        >
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {page.length}
          </strong>{' '}
        </span>
      </div>
    </div>
  );
};

export default Table;
