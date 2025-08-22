import { useEffect, useState } from 'react';

const JOB_IDS_URL = 'https://hacker-news.firebaseio.com/v0/jobstories.json';
const JOB_DETAILS_URL = 'https://hacker-news.firebaseio.com/v0/item';
const failSymbol = Symbol('Failed promise');
/**
 * Fetches job details for the given array of job IDs.
 * @param {number[]} ids - Array of job IDs.
 */
const fetchJobDetails = async (ids) => {
  try {
    const jobsPromises = ids.map(async (id) => {
      const res = await fetch(`${JOB_DETAILS_URL}/${id}.json`);
      if (!res.ok) throw new Error(`Failed fetching job ${id}`);
      return res.json();
    });

    const jobsData = await Promise.allSettled(jobsPromises);
    const fulfilledPromises = jobsData
      .map((data) => (data.status === 'fulfilled' ? data.value : failSymbol))
      .filter((data) => data !== failSymbol); // allow undefined values in rare cases

    return fulfilledPromises;
  } catch (err) {
    throw new Error('fails');
  }
};

// type AsyncFunc = (...args: any[]) => Promise<any>

// type UseAsyncReturn<T extends AsyncFunc> = {
//   data: Awaited<ReturnType<T>>,
//   isLoading: boolean,
//   error: any,
//   refetch: T
// }

// function useAsync<T extends AsyncFunc)>(fn: T, initialArgs: Arguments<T>): UseAsyncReturn<T> {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [data, setData] = useState<Awaited<ReturnType<T>> | undefined>(undefined)

//   const func = useRef((...args: Arguments<T>) => {
//       try {
//         setIsLoading(true);
//         setData(await func.current(...initialArgs));
//       } catch (err) {
//         setIsError(err);
//       } finally {
//         setIsLoading(false)
//       }
//   }); // get a stable reference to function
//   useEffect(() => {
//     func.current(...initialArgs)
//   }, [func.current])

//   return {
//     data,
//     isLoading,
//     isError,
//     refetch: func.current
// }

// in your component:
// const {data, isLoading, isError, refetch} = useAsync((jobIds: string[]) => fetchJobDetails(jobIds), [])
// const [jobs, setJobs] = useState([]);

// if(data?.length) {
//   setJobs(data)
// }

// function onClickNext() {
//   const newJobs = refetch(jobIds) // or whatever
//   setJobs([...jobs, ...newJobs])
// }

export default function App() {
  const [jobIds, setJobIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJobIds = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(JOB_IDS_URL);
        if (!response.ok) throw new Error('Failed fetching job IDs');
        const jobIdsData = await response.json();
        setJobIds(jobIdsData);
        if (jobIdsData.length > 0) {
          const initialJobIds = jobIdsData.slice(0, 6);
          const initJobsData = await fetchJobDetails(initialJobIds);
          setJobs(initJobsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobIds();
  }, [fetchJobDetails]);

  const handleFetchMore = async () => {
    const currentJobCount = jobs.length;
    const nextJobs = jobIds.slice(currentJobCount, currentJobCount + 6);
    setIsLoading(true);
    try {
      const jobsData = await fetchJobDetails(nextJobs);
      setJobs((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        jobsData.forEach((job) => {
          if (!seen.has(job.id)) {
            merged.push(job);
          }
        });
        return merged;
      });
    } catch {
      throw new Error('fails');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'beige', padding: '10px' }}>
      <h1>Job Board</h1>
      {error && <p>Error: {error}</p>}
      {isLoading && <p>Loading...</p>}
      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            backgroundColor: 'white',
            padding: '10px',
            margin: '10px',
            borderRadius: '6px',
            border: '1px black solid',
          }}
        >
          <a
            href={job.url}
            target='_blank'
            rel='noopener noreferrer'
            style={{
              color: 'black',
              textDecoration: 'none',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            {job.title}
          </a>
          <div>
            By {job.by} * {new Date(job.time).toLocaleString()}
          </div>
        </div>
      ))}
      <button
        onClick={handleFetchMore}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? 'grey' : 'orange',
          color: 'white',
          padding: '10px',
          border: '1px white solid',
          borderRadius: '6px',
          marginLeft: '10px',
          cursor: 'pointer',
        }}
      >
        Fetch Next 6 Jobs
      </button>
    </div>
  );
}
