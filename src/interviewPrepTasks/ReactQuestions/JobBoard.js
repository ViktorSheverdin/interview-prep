import { useEffect, useState } from 'react';

const JOB_IDS = 'https://hacker-news.firebaseio.com/v0/jobstories.json';
const JOB_DETAILS = 'https://hacker-news.firebaseio.com/v0/item/';
const DEFAULT_POSTS_NUMBER = 6;

export const Job = (props) => {
  const { by, time, title, url } = props;
  const formatedDate = new Date(time).toLocaleString();
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '6px',
        marginTop: '20px',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ padding: '10px' }}>
        <a
          href={url}
          target='_blank'
          rel='noreferrer'
          style={{ color: 'black', textDecoration: 'none' }}
        >
          {title}
        </a>
      </h3>
      <div style={{ padding: '10px' }}>
        <span>By {by}</span> * <span>{formatedDate}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [postIdsList, setPostIdsList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [numberOfPosts, setNumberOfPosts] = useState(DEFAULT_POSTS_NUMBER);
  const [isLoading, setIsLoading] = useState(false);

  const isLoadMoreDisabled = isLoading || numberOfPosts >= postIdsList.length;

  const fetchJobIds = async () => {
    try {
      setIsLoading(true);
      const data = await fetch(JOB_IDS);
      if (!data.ok) throw new Error('Error fetching job IDs');
      const ids = await data.json();
      setPostIdsList(ids);
    } catch {
      throw new Error('Unabled to fetch');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobDetails = async (idsList) => {
    try {
      setIsLoading(true);
      const postsPromises = idsList.map((postId) => {
        return fetch(`${JOB_DETAILS}${postId}.json`).then((res) => {
          if (!res.ok) throw new Error('Error fetching post details');
          const responseData = res.json();
          return responseData;
        });
      });
      const postsData = await Promise.all(postsPromises);
      setJobList((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        postsData.forEach((post) => {
          if (!seen.has(post.id)) merged.push(post);
        });
        return merged;
      });
    } catch {
      throw new Error('Error fetching job details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobIds();
  }, []);

  useEffect(() => {
    if (!postIdsList.length) return;

    const targetIds = postIdsList.slice(
      numberOfPosts - DEFAULT_POSTS_NUMBER,
      numberOfPosts
    );

    if (!targetIds.length) return;
    fetchJobDetails(targetIds);
  }, [postIdsList, numberOfPosts]);

  const handleLoadMore = () => {
    setNumberOfPosts((prev) => prev + DEFAULT_POSTS_NUMBER);
  };

  return (
    <div style={{ backgroundColor: 'beige' }}>
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '30px', fontWeight: '700', color: 'orange' }}>
          Hacker News Jobs Board
        </div>
        {jobList.map((jobItem) => {
          return (
            <div key={jobItem.id}>
              <Job
                by={jobItem.by}
                time={jobItem.time}
                title={jobItem.title}
                url={jobItem.url}
              />
            </div>
          );
        })}
        <button
          style={{
            backgroundColor: isLoadMoreDisabled ? '#ccc' : 'orange',
            color: 'white',
            padding: '10px',
            border: '1px solid',
            borderColor: isLoadMoreDisabled ? '#ccc' : 'orange',
            borderRadius: '6px',
            cursor: isLoadMoreDisabled ? 'not-allowed' : 'pointer',
            opacity: isLoadMoreDisabled ? 0.6 : 1,
          }}
          onClick={handleLoadMore}
          disabled={isLoadMoreDisabled}
        >
          Load more jobs
        </button>
      </div>
    </div>
  );
}
