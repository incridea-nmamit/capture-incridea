import React from 'react'
import Loading from '~/pages/Loading'
import { api } from '~/utils/api'
import { verficationcolumns } from './coloums'
import { DataTable } from './data-table'

/**
 * AdminPlayBacks Component
 * Main component for managing playback videos in admin panel
 * Displays a table of all playbacks with management options
 */
const EmailVerifications = () => {
  // Fetch playbacks data
  const { data: verfications = [], isLoading } = api.verfication.getAllVerfiedEmails.useQuery()

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-4xl font-Teknaf mb-8 py-5 text-center">
        Email verfications
      </h1>
      <DataTable columns={verficationcolumns} data={verfications} />
    </div>
  )
}

export default  EmailVerifications
