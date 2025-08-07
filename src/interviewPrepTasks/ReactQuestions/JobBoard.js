import { useEffect, useState } from 'react';

const JOB_IDS = 'https://hacker-news.firebaseio.com/v0/jobstories.json';
const JOB_DETAILS = 'https://hacker-news.firebaseio.com/v0/item/';
const DEFAULT_POSTS_NUMBER = 6;

export const Job = () => {
  return (
    <div>
      <div>Job</div>
    </div>
  );
};

export default function App() {
  const [postIdsList, setPostIdsList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [numberOfPosts, setNumberOfPosts] = useState(DEFAULT_POSTS_NUMBER);

  const fetchJobIds = async () => {
    try {
      const data = await fetch(JOB_IDS);
      if (!data.ok) throw new Error('Error fetching job IDs');
      const ids = await data.json();
      setPostIdsList(ids);
    } catch {
      throw new Error('Unabled to fetch');
    }
  };

  const fetchJobDetails = async () => {
    const postsPromises = postIdsList
      .slice(numberOfPosts - DEFAULT_POSTS_NUMBER, numberOfPosts)
      .map((postId) => {
        return fetch(`${JOB_DETAILS}${postId}.json`).then((res) => {
          if (!res.ok) throw new Error('Error fetching post details');
          const responseData = res.json();
          return responseData;
        });
      });
    const postsData = await Promise.all(postsPromises);
    setJobList((prev) => [...prev, ...postsData]);
  };

  useEffect(() => {
    fetchJobIds();
  }, []);

  useEffect(() => {
    if (postIdsList.length > 0) {
      fetchJobDetails();
    }
  }, [postIdsList, numberOfPosts]);

  const handleLoadMore = () => {
    setNumberOfPosts((prev) => prev + DEFAULT_POSTS_NUMBER);
  };

  return (
    <div>
      {jobList.map((jobItem) => {
        return (
          <div key={jobItem.id}>
            <Job />
          </div>
        );
      })}
      <button onClick={handleLoadMore}>Load more jobs</button>
    </div>
  );
}
