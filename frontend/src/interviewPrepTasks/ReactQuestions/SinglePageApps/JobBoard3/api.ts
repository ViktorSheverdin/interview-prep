const JOB_IDS_URL = 'https://hacker-news.firebaseio.com/v0/jobstories.json';
const JOB_DETAILS_URL = 'https://hacker-news.firebaseio.com/v0/item';

export const getJobIds = async (): Promise<number[]> => {
  try {
    const res = await fetch(JOB_IDS_URL);
    return res.json();
  } catch {
    throw new Error('Failed to fetch jobs');
  }
};

export interface JobDetails {
  by: string;
  id: number;
  score: number;
  text: string;
  time: number;
  title: string;
  type: string;
  url: string;
}

export const getJobDetails = async (id: number): Promise<JobDetails> => {
  try {
    const res = await fetch(`${JOB_DETAILS_URL}/${id}.json`);
    return res.json();
  } catch {
    throw new Error(`Failed to fetch job detail id: ${id}`);
  }
};
