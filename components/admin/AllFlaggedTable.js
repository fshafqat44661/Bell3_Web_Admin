import Card from "@/components/ui/Card";

const AllFlaggedTable = ({rows,columns}) => {
    return (
        <div className="flex w-full">
            <Card title="basic table" noborder>
                <div className="overflow-x-auto ">
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
                                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                {rows.map((row, i) => (
                                    <tr key={i}>
                                        <td className="table-td">{row.content_post.id}</td>
                                        <td className="table-td">{row.predefined_reason}</td>
                                        <td className="table-td">{row.custom_reason}</td>
                                        <td className="table-td">{row.status}</td>
                                        <td className="table-td">{row.content_post.title}</td>
                                        <td className="table-td">{row.content_post.content}</td>
                                        {/* Render creator's username or email based on availability */}
                                        <td className="table-td">{row.content_post.user.creator_username ?? row.content_post.user.creator_email}</td>
                                        {/* Access properties of `row.flagged_by` */}
                                        <td className="table-td">{row.flagged_by.username ?? row.flagged_by.email}</td>
                                        {/* Access specific property of `row.reviewed_by` */}
                                        <td className="table-td">{row.reviewed_by ? row.reviewed_by.username : ""}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Card>

        </div>
    );
}

export default AllFlaggedTable
