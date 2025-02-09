/**
 * Main TeamAdmin Module
 * Manages display and operations for team member data
 */
import React from 'react';
import { api } from '~/utils/api';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { DataTable } from './data-table';
import { Teamcolumns } from './coloums';

const TeamAdmin: React.FC = () => {
  // Query hook for team data fetching
  const { data: teams, isLoading, isError } = api.team.getAllTeams.useQuery();

  // Handle loading and error states
  if (isLoading) return <CameraLoading />;
  if (isError) return <div>Error loading teams. Please try again later.</div>;

  // Transform data to handle optional social media fields
  const transformedTeams = teams?.map((team) => ({
    ...team,
    github: team.github ?? undefined,
    linkedin: team.linkedin ?? undefined,
    instagram: team.instagram ?? undefined,
    behance: team.behance ?? undefined,
  }));

  return (
    <div className='p-3'>
      <div className="mb-4 items-center justify-center flex mx-auto">
        <h1 className="text-3xl text-center items-center font-semibold">Team Data & Management</h1>
      </div>
      <DataTable columns={Teamcolumns} data={transformedTeams!} />
    </div>
  );
};

export default TeamAdmin;