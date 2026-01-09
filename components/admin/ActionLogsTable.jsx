/* eslint-disable react/display-name */
import React, { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import {
  useTable,
  useRowSelect,
  usePagination,
} from "react-table";

const ActionLogsTable = ({ total, responseData, isLoading, currentPage }) => {

  const COLUMNS = [
    {
      Header: "ID",
      accessor: "id",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Action Type",
      accessor: "action_type",
      Cell: (row) => {
        const actionType = row?.cell?.value || "N/A";
        let badgeClass = "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"; // default
        
        const lowerAction = actionType.toLowerCase();

        if (lowerAction === 'ban') {
            badgeClass = "bg-danger-500 text-white";
        } else if (lowerAction === 'unban') {
             badgeClass = "bg-success-500 text-white";
        } else if (lowerAction === 'shadowban' || lowerAction === 'shadow_ban') {
            badgeClass = "bg-warning-500 text-white";
        }

        return (
          <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${badgeClass}`}>
             {actionType}
          </span>
        );
      },
    },
    {
        Header: "Admin",
        accessor: "admin",
        Cell: (row) => {
            const admin = row?.cell?.value;
            const name = admin ? (admin.username || admin.first_name || `Admin #${admin.id}`) : "System";
            return (
                <div className="flex items-center">
                    <div className="grid gap-1">
                         <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{name}</span>
                         {admin?.id && <span className="text-xs text-slate-500 dark:text-slate-400">ID: {admin.id}</span>}
                    </div>
                </div>
            );
        },
    },
    {
        Header: "Target User",
        accessor: "user", 
        Cell: (row) => {
            const user = row?.cell?.value;
            // Handle cases where user might be null or deleted
            if (!user) return <span className="text-sm text-slate-500 italic">User not found</span>;
            
            const name = user.username || (user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.last_name) || `User #${user.id}`;
            return (
                 <div className="flex items-center">
                    <div className="grid gap-1">
                         <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{name}</span>
                         <span className="text-xs text-slate-500 dark:text-slate-400">ID: {user.id}</span>
                    </div>
                </div>
            );
        },
    },
    {
      Header: "Date",
      accessor: "created_at",
      Cell: (row) => {
        const dateValue = row?.cell?.value;
        if (!dateValue) return <span className="text-sm text-slate-500">N/A</span>;
        
        const dateObj = new Date(dateValue);
        return (
            <div className="grid gap-1">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                    {dateObj.toLocaleDateString()}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                    {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => responseData || [], [responseData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    usePagination,
    useRowSelect
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
  } = tableInstance;


  return (
    <>
      <Card>
        <div className="items-center justify-between mb-6 md:flex">
          <h4 className="card-title">Action Logs ({total})</h4>
        </div>
        <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700"
                {...getTableProps()}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          key={column.id}
                          {...column.getHeaderProps()}
                          scope="col"
                          className="table-th"
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps()}
                >
                  {isLoading ? (
                    <tr>
                      <td colSpan={columns.length} className="table-td text-center py-12">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span className="text-slate-600 dark:text-slate-400">
                            Loading logs...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : page.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="table-td text-center py-12">
                        <div className="text-center">
                          <p className="text-slate-600 dark:text-slate-400">
                            No action logs recorded
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr key={row.id} {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                            <td key={cell.id} {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ActionLogsTable;
