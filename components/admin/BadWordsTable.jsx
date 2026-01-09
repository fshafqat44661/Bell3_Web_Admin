"use client";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import React from "react";



const columns = [
    {
        label: "ID",
        field: "id",
    },

    {
        label: "Name",
        field: "name",
    },
    {
        label: "Created at",
        field: "created_at",
    },
    {
        label: "Actions",
        field: "actions"
    }

];




const BasicTablePage = ({rows, handleDelete, isLoading}) => {

    return (
        <div>
            <Card title="Badwords" noborder>
                <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden ">
                            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                                <thead className=" border-t border-slate-100 dark:border-slate-800">
                                <tr>
                                    {columns.map((column, i) => (
                                        <th key={i} scope="col" className=" table-th ">
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody
                                    className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={columns.length} className="table-td text-center py-12">
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                                <span className="text-slate-600 dark:text-slate-400">Loading badwords...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="table-td text-center py-12">
                                            <div className="text-center">
                                                <div className="text-slate-400 mb-2">
                                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400">No badwords available</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row, i) => (
                                        <tr key={i}>
                                            <td className="table-td">{row.id}</td>
                                            <td className="table-td">{row.name}</td>
                                            <td className="table-td ">{row.created_at}</td>
                                            <td className="table-td">
                                                <button
                                                    className="btn btn-danger text-white flex items-center justify-center"
                                                    onClick={() => handleDelete(row.id)}
                                                >
                                                    <Icon icon="heroicons-outline:trash" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Card>

        </div>
    );
};

export default BasicTablePage;
