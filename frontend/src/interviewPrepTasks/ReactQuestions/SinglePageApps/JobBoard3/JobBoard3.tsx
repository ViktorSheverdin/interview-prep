import { useQueries, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getJobDetails, getJobIds, type JobDetails } from './api';

export const JobBoard3 = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const {
    data: jobIds,
    isLoading: isLoadingJobIds,
    isError: isErrorJobIds,
  } = useQuery({
    queryKey: ['jobIds'],
    queryFn: getJobIds,
  });

  const visibleJobs = jobIds?.slice(0, visibleCount) ?? [];

  const { data: jobsDetails, isLoading: isLoadingJobsDetails } = useQueries({
    queries: visibleJobs.map((id) => {
      return {
        queryKey: ['jobDetails', id],
        queryFn: () => getJobDetails(id),
        enabled: !!visibleJobs,
      };
    }),
    combine: (results) => {
      return {
        data: results
          .map((result) => result.data)
          .filter((job): job is JobDetails => Boolean(job)),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  if (isLoadingJobIds) return <div>Loading...</div>;
  if (isErrorJobIds) return <div>Error loading jobs...</div>;

  return (
    <div>
      <div>Interview prep</div>{' '}
      <button
        disabled={isLoadingJobsDetails}
        onClick={handleLoadMore}
      >
        Load more
      </button>
      <div>
        {jobsDetails.map((job) => {
          return (
            <div
              key={job.id}
              style={{
                border: '1px solid black',
                margin: '10px',
                padding: '10px',
              }}
            >
              <a
                href={job.url}
                target='_blank'
                rel='nooperner noreferrer'
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                {job.title}
              </a>
              <p>{job.text}</p>
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}
              >
                <p>By: {job.by}</p>
                <p>Data: {new Date(job.time).toLocaleDateString('us')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
