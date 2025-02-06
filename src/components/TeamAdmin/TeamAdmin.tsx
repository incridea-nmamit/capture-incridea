import React from 'react';
import { api } from '~/utils/api';
import CameraLoading from '../LoadingAnimation/CameraLoading';
import { DataTable } from './data-table';
import { Teamcolumns } from './coloums';

const TeamAdmin: React.FC = () => {
  const { data: teams, isLoading, isError } = api.team.getAllTeams.useQuery();

  if (isLoading) return <CameraLoading />;
  if (isError) return <div>Error loading teams. Please try again later.</div>;

  // Transform the data to match the expected type
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