import React, { useEffect, useMemo, useState } from "react";
import { TableState,useTable, useSortBy, useFilters, usePagination, useGlobalFilter, Column } from "react-table";
import { ClimateRiskDatatableProps } from "../types/ClimateRiskDatatableProps";
import { ReactNode } from 'react';
import { ClimateRiskData } from "../types/ClimateRiskData";

function isReactNode(value: unknown): value is ReactNode {
  return typeof value === 'string' || typeof value === 'number' || React.isValidElement(value);
}

const ClimateRiskFactorsColumn = ({ values }: { values:string })  => {
  return(
    <>
    {Object.entries(JSON.parse(values)).map((entry) => {
      const [key, value] = entry;
      return (
        <tr key={key}>
          <td>{key}</td>
          <td> : </td>
          <td>{isReactNode(value) ? value : null}</td>
        </tr>
      );
    })}
    </>
  );
}

export const ClimateRiskDataTable:React.FC<ClimateRiskDatatableProps>  = ({ climateRiskData, year }) => {
  const [filterClimateRiskData, setFilterClimateRiskData] = useState<ClimateRiskData[]>([]);

  const columns = useMemo<Column<ClimateRiskData>[]>(
    () => [
      {
        Header: "Asset Name",
        accessor: "asset_name",
      },
      {
        Header: "Latitude",
        accessor: "lat",
      },
      {
        Header: "Longitude",
        accessor: "lng",
      },
      {
        Header: "Business Category",
        accessor: "business_category",
      },
      {
        Header: "Risk Rating",
        accessor: "risk_rating",
      },
      {
        Header: 'Risk Factors',
        accessor:"risk_factors",
        Cell: ({ cell: { value } }) => <ClimateRiskFactorsColumn values={value} />
      },
      {
        Header: "Year",
        accessor: "year",
      },
    ],
    []
  );

  useEffect(() => {
    const filterClimateRiskData = climateRiskData.filter((marker) => {
      const markerYear = Math.floor(marker.year / 10) * 10; // Round down to nearest decade
      return markerYear === year;
    });
    setFilterClimateRiskData(filterClimateRiskData);
  }, [climateRiskData, year]);

  const {
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    page, 
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    gotoPage,
    pageCount,
    setPageSize,
    state: { 
      pageIndex,
      pageSize, 
      globalFilter 
    },
    setGlobalFilter 
  } = useTable(
    {
      columns,
      data:filterClimateRiskData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        globalFilter: "",
        manualPagination: true,
      } as Partial<TableState<ClimateRiskData>>,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <label htmlFor="global-search" className="mr-2 font-medium text-gray-700">
            Search:
          </label>
          <input
            id="global-search"
            type="text"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-2 py-1 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <table {...getTableProps()} className="table-auto border-collapse bg-white">
        <thead className="bg-gray-100">
          {headerGroups.map((headerGroup:any, index:any) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column:any, columnIndex:any) => (
                <th
                  key={columnIndex}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-3 text-left cursor-pointer font-bold text-gray-700 uppercase tracking-wider"
                >
                  {column.render("Header")}
                  <span className="ml-1">
                    {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row:any, rowIndex:any) => {
            prepareRow(row);
            return (
              <tr
                key={rowIndex}
                {...row.getRowProps()}
                className="bg-gray-50 hover:bg-gray-100 transition-all duration-100 ease-in-out"
              >
                {row.cells.map((cell:any, cellIndex:any) => (
                  <td key={cellIndex} {...cell.getCellProps()} className="px-6 py-4 text-black">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination flex flex-wrap justify-center items-center my-4">
        <button
          className="px-3 py-1 mr-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button
          className="px-3 py-1 mr-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>{" "}
        <button
          className="px-3 py-1 mr-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>{" "}
        <button
          className="px-3 py-1 mr-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>{" "}
        <span className="text-gray-500">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span className="mx-2 text-gray-500">|</span>
        <span className="mr-2 text-gray-500">Go to page:</span>
        <input
          className="px-2 py-1 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
          style={{ width: "50px" }}
        />
        <span className="mx-2 text-gray-500">|</span>
        <span className="mr-2 text-gray-500">Show:</span>
        <select
          className="px-2 py-1 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize} className="text-black">
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
  
};
