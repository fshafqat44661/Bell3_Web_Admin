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


const UsersTable = ({ total, responseData, fetchData, isLoading, searchTerm, currentPage }) => {

    const [actionModal, setActionModal] = useState({ open: false, type: null, user: null });
    const [actionReason, setActionReason] = useState("");
    const [actionLoading, setActionLoading] = useState(null); // { id: 1, type: 'ban' }

    const BAN_REASONS = [
        "Harassment / Bullying",
        "Vulgarity / Offensive Language",
        "Racism / Hate Speech",
        "Sexual Content / Nudity",
        "Fraud / Scam Behavior",
        "Spam Activity",
        "Threats or Violence"
    ];

    const handleActionSubmit = async () => {
        const { type, user } = actionModal;
        if (!user) return;

        // For ban/shadowban (adding), require reason
        if ((type === 'ban' || type === 'shadowban') && !actionReason) {
            toast.error("Please select a reason.");
            return;
        }

        const endpoint = type === 'ban' ? 'ban-toggle' : type === 'shadowban' ? 'shadowban-toggle' : '';
        if (!endpoint) return;

        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('status', 1);
        formData.append('reason', actionReason);

        try {
            setActionLoading({ id: user.id, type: type });
            const response = await fetch(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/users/${endpoint}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "ngrok-skip-browser-warning": "true",
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(data.message);
                closeActionModal();
                if (fetchData) fetchData(currentPage || 1, searchTerm || '');
            } else {
                toast.error(data.message || `Failed to ${type} user.`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDirectAction = async (user, type) => {
        // for unban / remove-shadowban
        const isUnban = type === 'unban';
        const endpoint = isUnban ? 'ban-toggle' : 'shadowban-toggle';

        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('status', 0);

        try {
            setActionLoading({ id: user.id, type: type });
            const response = await fetch(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/users/${endpoint}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "ngrok-skip-browser-warning": "true",
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(data.message);
                if (fetchData) fetchData(currentPage || 1, searchTerm || '');
            } else {
                toast.error(data.message || `Failed to ${isUnban ? 'unban' : 'remove shadowban'}.`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.");
        } finally {
            setActionLoading(null);
        }
    };


    const openActionModal = (user, type) => {
        setActionModal({ open: true, type, user });
        setActionReason(BAN_REASONS[0]);
    };

    const closeActionModal = () => {
        setActionModal({ open: false, type: null, user: null });
        setActionReason("");
    };

    const COLUMNS = [
        {
            Header: "user id ",
            accessor: "id",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
        {
            Header: "username",
            accessor: "username",
            Cell: (row) => {
                return <span>{row?.cell?.value ?? 'N/A'}</span>;
            },
        },
        {
            Header: "Profile photo",
            accessor: "profile_photo_url",
            Cell: (row) => {
                const photoUrl = row?.cell?.value || row?.row?.original?.profile_picture;
                return (
                    <div>
                        <span className="inline-flex items-center">
                            <span className="flex-none rounded-full w-7 h-7 ltr:mr-3 rtl:ml-3 bg-slate-600">
                                <img
                                    src={photoUrl}
                                    alt=""
                                    className="object-cover w-full h-full rounded-full"
                                />
                            </span>
                        </span>
                    </div>
                );
            },
        },
        {
            Header: "First Name",
            accessor: "first_name",
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
            Header: "Last Name",
            accessor: "last_name",
            Cell: (row) => {
                const lastName = row?.cell?.value;
                return (
                    <div>
                        <span className="inline-flex items-center">
                            <span className="text-sm capitalize text-slate-600 dark:text-slate-300">
                                {lastName ? lastName.substring(0, 20) : 'N/A'}
                            </span>
                        </span>
                    </div>
                );
            },
        },
        {
            Header: "Email",
            accessor: "email",
            Cell: (row) => {
                return (
                    <div>
                        <span className="inline-flex items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                {row?.cell?.value ?? 'N/A'}
                            </span>
                        </span>
                    </div>
                );
            },
        },
        {
            Header: "Stripe Onboarded",
            accessor: "stripe_onboarding_completed",
            Cell: (row) => {
                return (
                    <div>
                        <span className="inline-flex items-center">
                            <span className="text-sm capitalize text-slate-600 dark:text-slate-300">
                                {row?.cell?.value == 1 ? "Yes" : row?.cell?.value == 0 ? "No" : "N/A"}
                            </span>
                        </span>
                    </div>
                );
            },
        },
        {
            Header: "Stripe Connect ID",
            accessor: "stripe_connect_id",
            Cell: (row) => {
                return (
                    <div>
                        <span className="inline-flex items-center">
                            <span className="text-sm capitalize text-slate-600 dark:text-slate-300">
                                {row?.cell?.value ?? 'N/A'}
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
                return <span>{row?.cell?.value ?? 'N/A'}</span>;
            },
        },
        {
            Header: "Actions",
            accessor: "action",
            Cell: (row) => {
                const user = row?.row?.original;
                // Correctly check for "1" (string) or 1 (number)
                const isBanned = user.is_banned == 1;
                const isShadowBanned = user.is_shadowbanned == 1;

                const isBanLoading = actionLoading?.id === user.id && (actionLoading?.type === 'ban' || actionLoading?.type === 'unban');
                const isShadowLoading = actionLoading?.id === user.id && (actionLoading?.type === 'shadowban' || actionLoading?.type === 'remove-shadowban');

                return (
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => isBanned ? handleDirectAction(user, 'unban') : openActionModal(user, 'ban')}
                            disabled={isBanLoading}
                            className={`px-3 py-1 text-xs font-medium rounded-full border transition-all 
                                ${isBanned
                                    ? 'border-success-500 text-success-500 hover:bg-success-500 hover:text-white'
                                    : 'border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white'}
                                ${isBanLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {isBanLoading ? 'Processing...' : (isBanned ? 'Unban' : 'Ban')}
                        </button>
                        <button
                            onClick={() => isShadowBanned ? handleDirectAction(user, 'remove-shadowban') : openActionModal(user, 'shadowban')}
                            disabled={isShadowLoading}
                            className={`px-3 py-1 text-xs font-medium rounded-full border transition-all
                                ${isShadowBanned
                                    ? 'border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white'
                                    : 'border-slate-500 text-slate-500 hover:bg-slate-500 hover:text-white'}
                                ${isShadowLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {isShadowLoading ? 'Processing...' : (isShadowBanned ? 'Remove Shadowban' : 'Shadowban')}
                        </button>
                    </div>
                );
            }
        }
    ];

    const columns = useMemo(() => COLUMNS, [actionLoading]); // Dependency added for re-render
    const data = useMemo(() => responseData || [], [responseData]);

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
                    <h4 className="card-title">All Creators ({total})</h4>
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
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        {searchTerm ? 'Searching users...' : 'Loading users...'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : page.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="table-td text-center py-12">
                                                <div className="text-center">
                                                    <div className="text-slate-400 mb-2">
                                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        {searchTerm ? `No users found matching "${searchTerm}"` : 'No users available'}
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

            <Modal
                title={actionModal.type === 'ban' ? "Ban User" : "Shadowban User"}
                activeModal={actionModal.open}
                onClose={closeActionModal}
                centered={true}
                themeClass={actionModal.type === 'ban' ? "bg-danger-500" : "bg-slate-900 dark:bg-slate-800"}
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Select a reason for {actionModal.type === 'ban' ? 'banning' : 'shadowbanning'} <strong>{actionModal.user?.username || actionModal.user?.first_name}</strong>.
                    </p>
                    <div>
                        <label className="form-label mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Reason</label>
                        <select
                            className="form-control w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white transition-all"
                            value={actionReason}
                            onChange={(e) => setActionReason(e.target.value)}
                        >
                            {BAN_REASONS.map((reason, index) => (
                                <option key={index} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            className="btn btn-secondary px-4 py-2 rounded"
                            onClick={closeActionModal}
                        >
                            Cancel
                        </button>
                        <button
                            className={`btn px-4 py-2 rounded text-white ${actionModal.type === 'ban' ? 'bg-danger-500 hover:bg-danger-600' : 'bg-slate-900 hover:bg-slate-800'}`}
                            onClick={handleActionSubmit}
                            disabled={actionLoading?.id === actionModal.user?.id}
                        >
                            {actionLoading?.id === actionModal.user?.id ? 'Processing...' : (actionModal.type === 'ban' ? 'Ban User' : 'Shadowban User')}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default UsersTable;
