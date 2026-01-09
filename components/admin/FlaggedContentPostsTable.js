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
            Header: "ID",
            accessor: "id",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "Predefined Reason",
            accessor: "predefined_reason",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "content image",
            accessor: "content_post.content_files",
            Cell: (row) => {
                const contentFiles = row?.cell?.value;
                if (!contentFiles || contentFiles.length === 0) {
                    return <span>No Files</span>;
                }
                <div>
                    {contentFiles.map((file, index) => (
                        <img
                            key={index}
                            src={file.file_reference_url}
                            alt={`Content File ${index}`}
                            style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                    ))}
                </div>
            },
        },
        {
            Header: "Custom Reason",
            accessor: "custom_reason",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "Flag Count",
            accessor: "flag_count",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "Flagged By",
            accessor: "flagged_by.email",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "Content Title",
            accessor: "content_post.title",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "Created At",
            accessor: "content_post.created_at",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },

        {
            Header: "action",
            accessor: "action",
            Cell: (row) => {
                console.log(row.row.values['content_post.content_files'])
                return (
                    <div className="flex space-x-3 rtl:space-x-reverse justify-center items-center">
                        <Modal
                            title={<Icon icon="heroicons:eye" />}
                            label={<Icon icon="heroicons:eye" />}
                            uncontrol
                        >
                            <h4 className="font-medium text-lg mb-3 text-slate-900">
                                {row.row.values['content_post.title']}
                            </h4>
                            <div className="text-base text-slate-600 dark:text-slate-300">
                                {row.row.values['content_post.content']}
                            </div>
                            {row.row.values['content_post.content_files'] && row.row.values['content_post.content_files'].map(({ file_reference_url, file_type }) => (
                                <div className="text-base text-slate-600 dark:text-slate-300" key={file_reference_url}>
                                    <div className="relative h-[600px] w-full mb-6">
                                        {file_type === 'video' ? (
                                            <video controls className="absolute inset-0 w-full h-full object-contain rounded-md">
                                                <source src={file_reference_url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <img
                                                src={file_reference_url}
                                                className="absolute inset-0 w-full h-full object-contain rounded-md"
                                                alt="Content File"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Modal>
                        <Tooltip
                            content="Ignore Flag"
                            placement="top"
                            arrow
                            animation="shift-away"
                            theme="info"
                        >
                            <button className="action-btn" type="button"
                                onClick={() => handleRejectFlag(row.row.values.id)}
                            >
                                <Icon icon="heroicons:shield-check" />

                            </button>
                        </Tooltip>
                        <Tooltip
                            content="Delete Post"
                            placement="top"
                            arrow
                            animation="shift-away"
                            theme="danger"
                        >
                            <button className="action-btn" type="button"
                                onClick={() => handleDeletePost(row.row.values.id)}
                            >
                                <Icon icon="heroicons:minus-circle" />

                            </button>
                        </Tooltip>

                    </div>
                );
            },
        }
    ];

    const handleRejectFlag = async (id) => {
        fetch(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/flagged-content-posts/${id}/reject`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then((response) => {
                console.log(response.body)
                if (response.ok) {
                    toast.success(response.message, {
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

    const handleDeletePost = async (id) => {

        fetch(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/flagged-content-posts/${id}/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then((response) => {
                if (response.ok) {
                    toast.success("Post has been soft deleted", {
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
                                                    <span>
                                                        {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? " 🔽"
                                                                : " 🔼"
                                                            : ""}
                                                    </span>
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
                                                    <span className="text-slate-600 dark:text-slate-400">Loading flagged posts...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : page.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="table-td text-center py-12">
                                                <div className="text-center">
                                                    <div className="text-slate-400 mb-2">
                                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-400">No flagged posts available</p>
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

export default ContentPostsTable;
