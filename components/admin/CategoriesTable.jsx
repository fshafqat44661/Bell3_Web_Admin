"use client";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
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

const CategoriesTable = ({rows, handleDeleteClick, handleEdit}) => {
    return (
        <div>
            <Card title="Categories" noborder>
                <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-visible ">
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
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="table-td text-center py-12">
                                            <div className="text-center">
                                                <div className="text-slate-400 mb-2">
                                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400">No categories available</p>
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
                                                <Dropdown
                                                    classMenuItems={`right-0 w-[140px] ${i === rows.length - 1 && rows.length > 1 ? 'bottom-[110%]' : 'top-[110%]'}`}
                                                    label={
                                                        <span className="text-xl text-center block w-full">
                                                        <Icon icon="heroicons-outline:dots-vertical" />
                                                        </span>
                                                    }
                                                >
                                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                        <div
                                                            className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center capitalize"
                                                            onClick={() => handleEdit(row)}
                                                        >
                                                            <span className="text-base"><Icon icon="heroicons:pencil-square" /></span>
                                                            <span>Edit</span>
                                                        </div>
                                                        <div
                                                            className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center capitalize text-danger-500"
                                                            onClick={() => handleDeleteClick(row)}
                                                        >
                                                            <span className="text-base"><Icon icon="heroicons-outline:trash" /></span>
                                                            <span>Delete</span>
                                                        </div>
                                                    </div>
                                                </Dropdown>
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

export default CategoriesTable;
