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
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";


const ContentPostsTable = ({ responseData, fetchData, isLoading }) => {

    const COLUMNS = [

        {
            Header: "content id ",
            accessor: "content_id",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "title",
            accessor: "content_title",
            Cell: (row) => {
                return <span className={'hidden'}>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "content image",
            accessor: "content_files",
            Cell: (row) => {
                return <span className={'hidden'}>{row?.cell?.value.file_reference_url}</span>;
            },
        },
        {
            Header: "Creator",
            accessor: "user",
            Cell: (row) => {
                return (
                    <div>
                        <span className="inline-flex items-center">
                            <span className="flex-none rounded-full w-7 h-7 ltr:mr-3 rtl:ml-3 bg-slate-600">
                                <img
                                    src={row?.cell?.value.creator_profile_photo}
                                    alt=""
                                    className="object-cover w-full h-full rounded-full"
                                />
                            </span>
                            <span className="text-sm capitalize text-slate-600 dark:text-slate-300">
                                {row?.cell?.value.first_name}
                            </span>
                        </span>
                    </div>
                );
            },
        },
        {
            Header: "Creator",
            accessor: "user.email",
            Cell: (row) => {
                return (
                    <div>
                        <span className="inline-flex items-center">
                            <span className="text-sm capitalize text-slate-600 dark:text-slate-300">
                                {row?.cell?.value}
                            </span>
                        </span>
                    </div>
                );
            },
        },
        {
            Header: "date",
            accessor: "created_at",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },

        {
            Header: "content",
            accessor: "content",
            Cell: (row) => {
                return <span className={'hidden'}>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "Content Status",
            accessor: "content_status",
            Cell: (row) => {
                return (
                    <span className="block w-full">
                        <span
                            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row?.cell?.value === "active"
                                    ? "text-success-500 bg-success-500"
                                    : ""
                                } 
            ${row?.cell?.value === "pending"
                                    ? "text-warning-500 bg-warning-500"
                                    : ""
                                }
            ${row?.cell?.value === "rejected"
                                    ? "text-danger-500 bg-danger-500"
                                    : ""
                                }
            
             `}
                        >
                            {row?.cell?.value}
                        </span>
                    </span>
                );
            },
        },
        {
            Header: "action",
            accessor: "action",
            Cell: (row) => {
                return (
                    <div className="flex space-x-3 rtl:space-x-reverse justify-center items-center">
                        <Modal
                            title={<Icon icon="heroicons:eye" />}
                            label={<Icon icon="heroicons:eye" />}
                            uncontrol
                        >
                            <h4 className="font-medium text-lg mb-3 text-slate-900">
                                {row.row.values.content}
                            </h4>
                            <div className="text-base text-slate-600 dark:text-slate-300">
                                {row.row.values.content_title}
                            </div>
                            {row.row.values.content_files && row.row.values.content_files.map(({ file_reference_url }) => (
                                <div className="text-base text-slate-600 dark:text-slate-300" key={file_reference_url}>
                                    <div className="relative h-[600px] w-full mb-6">
                                        <img
                                            src={file_reference_url}
                                            className="absolute inset-0 w-full h-full object-contain rounded-md"
                                            alt="Content File"
                                        />
                                    </div>
                                </div>
                            ))}
                        </Modal>
                        <Tooltip
                            content="Approve"
                            placement="top"
                            arrow
                            animation="shift-away"
                            theme="success"
                        >
                            <button className="action-btn" type="button"
                                onClick={() => handleApprovalDisapproval(row.row.values.content_id, true)}
                            >
                                <Icon icon="heroicons:check" />

                            </button>
                        </Tooltip>
                        <Tooltip
                            content="Dissaprove"
                            placement="top"
                            arrow
                            animation="shift-away"
                            theme="danger"
                        >
                            <button className="action-btn" type="button"
                                onClick={() => handleApprovalDisapproval(row.row.values.content_id, false)}
                            >
                                <Icon icon="heroicons:minus-circle" />

                            </button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];
    const handleApprovalDisapproval = async (id, approval = true) => {
        //TODO: Send to the be to approve this post
        let message = ""
        let status = 0;

        if (approval) {
            status = 1;
            message = "Post Approved "
        } else {
            status = -1;
            message = "Post Dissaproved"
        }


        // Create the request body
        const requestBody = {
            status: status,
        };

        fetch(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/contentposts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify(requestBody)
        })
            .then((response) => {
                if (response.ok) {
                    toast.success(message, {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });

                    //window.location.reload();
                    fetchData();
                }


            })
            .catch((err) => {
                console.log(err);
            })
    }

    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => Array.isArray(responseData) ? responseData : [], [responseData]);

    const tableInstance = useTable(
        {
            columns,
            data,
        },

        usePagination,
        useRowSelect,
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        state,
        prepareRow,
    } = tableInstance;

    const { globalFilter } = state;


    return (
        <>
            <Card>
                <div className="items-center justify-between mb-6 md:flex">
                    <h4 className="card-title">Pending Posts</h4>
                </div>
                <div className="-mx-6 overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table
                                className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700"
                                {...getTableProps}
                            >
                                <thead className="bg-slate-200 dark:bg-slate-700">
                                    {headerGroups.map((headerGroup) => {
                                        const { key, ...restHeaderGroupProps } =
                                            headerGroup.getHeaderGroupProps();
                                        <tr key={key} {...restHeaderGroupProps}>
                                            {headerGroup.headers.map((column) => {
                                                const { key, ...restColumn } = column.getHeaderProps();
                                                <th
                                                    key={key}
                                                    {...restColumn}
                                                    scope="col"
                                                    className=" table-th"
                                                >
                                                    {column.render("Header")}
                                                    <span>
                                                        {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? " 🔽"
                                                                : " 🔼"
                                                            : ""}
                                                    </span>
                                                </th>;
                                            })}
                                        </tr>;
                                    })}
                                </thead>
                                <tbody
                                    className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                                    {...getTableBodyProps}
                                >
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={columns.length} className="table-td text-center py-12">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                                    <span className="text-slate-600 dark:text-slate-400">Loading posts...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : page.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="table-td text-center py-12">
                                                <div className="text-center">
                                                    <div className="text-slate-400 mb-2">
                                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-400">No pending posts available</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        page.map((row) => {
                                            prepareRow(row);
                                            const { key, ...restRowProps } = row.getRowProps();
                                            return (
                                                <tr key={key} {...restRowProps}>
                                                    {row.cells.map((cell) => {
                                                        const { key, ...restCellProps } = cell.getCellProps();
                                                        return (
                                                            <td
                                                                key={key}
                                                                {...restCellProps}
                                                                className="table-td"
                                                            >
                                                                {cell.render("Cell")}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/*end*/}
            </Card>
        </>
    );
};

export default ContentPostsTable;
