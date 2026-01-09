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

const ProfilePictureReviewTable = ({ responseData, fetchData, isLoading }) => {
    const [loadingAction, setLoadingAction] = useState(null); // { id: 1, type: 'approve' }

    const COLUMNS = [
        {
            Header: "User",
            accessor: "user",
            Cell: (row) => {
                const user = row?.cell?.value;
                return (
                    <div className="flex items-center space-x-3">
                        <div className="flex-1 text-sm">
                            <div className="font-medium text-slate-600 dark:text-slate-300">
                                {user?.first_name} {user?.last_name}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400">
                                {user?.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            Header: "Submitted Picture",
            accessor: "file_path",
            Cell: (row) => {
                return (
                    <div className="flex items-center">
                        <Modal
                            title="Preview Picture"
                            label={
                                <div className="relative w-12 h-12 rounded bg-slate-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                    <img
                                        src={row?.cell?.value}
                                        className="w-full h-full object-cover"
                                        alt="Submission"
                                    />
                                </div>
                            }
                            uncontrol
                            centered
                        >
                            <div className="relative w-full aspect-square max-h-[70vh]">
                                <img
                                    src={row?.cell?.value}
                                    className="w-full h-full object-contain rounded"
                                    alt="Profile Submission"
                                />
                            </div>
                        </Modal>
                    </div>
                );
            },
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: (row) => {
                const status = row?.cell?.value;
                return (
                    <span className="block w-full text-center">
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-opacity-25 ${status === "approved"
                                ? "text-success-500 bg-success-500"
                                : status === "pending"
                                    ? "text-warning-500 bg-warning-500"
                                    : "text-danger-500 bg-danger-500"
                                }`}
                        >
                            {status}
                        </span>
                    </span>
                );
            },
        },
        {
            Header: "Requested At",
            accessor: "created_at",
            Cell: (row) => {
                return (
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                        {row?.cell?.value || "N/A"}
                    </span>
                );
            },
        },
        {
            Header: "Actions",
            accessor: "id",
            Cell: (row) => {
                const id = row?.cell?.value;
                const status = row?.row?.original?.status;

                if (status !== "pending") return <span className="text-slate-400 text-center block">-</span>;

                const isApproveLoading = loadingAction?.id === id && loadingAction?.type === "approve";
                const isRejectLoading = loadingAction?.id === id && loadingAction?.type === "reject";
                const isAnyLoading = loadingAction !== null;

                return (
                    <div className="flex space-x-3 justify-center items-center">
                        <Tooltip
                            content="Approve"
                            placement="top"
                            arrow
                            animation="shift-away"
                            theme="success"
                        >
                            <button
                                className={`w-8 h-8 rounded-full bg-success-500 bg-opacity-10 text-success-500 flex items-center justify-center hover:bg-success-500 hover:text-white transition-all ${isAnyLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleReviewAction(id, "approve")}
                                disabled={isAnyLoading}
                            >
                                {isApproveLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                ) : (
                                    <Icon icon="heroicons:check" />
                                )}
                            </button>
                        </Tooltip>
                        <Tooltip
                            content="Reject"
                            placement="top"
                            arrow
                            animation="shift-away"
                            theme="danger"
                        >
                            <button
                                className={`w-8 h-8 rounded-full bg-danger-500 bg-opacity-10 text-danger-500 flex items-center justify-center hover:bg-danger-500 hover:text-white transition-all ${isAnyLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleReviewAction(id, "reject")}
                                disabled={isAnyLoading}
                            >
                                {isRejectLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                ) : (
                                    <Icon icon="heroicons:x-mark" />
                                )}
                            </button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    const handleReviewAction = async (id, action) => {
        const isApprove = action === "approve";
        const message = isApprove ? "Profile picture approved!" : "Profile picture rejected.";
        const statusValue = isApprove ? "approved" : "rejected";

        try {
            setLoadingAction({ id, type: action });
            const response = await fetch(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/profile-pictures/${id}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({ status: statusValue })
            });

            if (response.ok) {
                toast.success(message);
                fetchData();
            } else {
                toast.error(`Failed to ${action} profile picture.`);
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoadingAction(null);
        }
    };

    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => Array.isArray(responseData) ? responseData : [], [responseData]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        usePagination,
        useRowSelect
    );

    return (
        <Card noborder>
            <div className="md:flex justify-between items-center mb-6">
                <h4 className="card-title">Pending Profile Reviews</h4>
            </div>
            <div className="overflow-x-auto -mx-6">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                        <table
                            className="min-w-full divide-y divide-slate-100 dark:divide-slate-700 table-fixed"
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
                                                className="table-th text-center"
                                            >
                                                <div className="flex justify-center items-center">
                                                    {column.render("Header")}
                                                </div>
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
                                                <span>Loading submissions...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : page.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="table-td text-center py-12">
                                            <p className="text-slate-500 dark:text-slate-400">No pending submissions found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    page.map((row) => {
                                        prepareRow(row);
                                        return (
                                            <tr key={row.id} {...row.getRowProps()}>
                                                {row.cells.map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        {...cell.getCellProps()}
                                                        className="table-td text-center"
                                                    >
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
    );
};

export default ProfilePictureReviewTable;
