import { api } from "~/utils/api";
import { auditcolumns } from "./coloums";
import { DataTable } from "./datatable";


import React from 'react'

const AuditLogs = () => {
    const { data: AduitLogs=[] } = api.audit.getAuditLog.useQuery()
    return (
        <div className='p-3'>
            <div className="mb-4 items-center justify-between flex mx-auto">
                <h1 className="text-2xl font-semibold">Audit Logs</h1>
            </div>
            <DataTable columns={auditcolumns} data={AduitLogs!} />
        </div>
    )
}

export default AuditLogs

