import { useEffect, useState } from 'react';

const CTF_URL =
  'https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/717561';

export const useGetURL = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [urlData, setURLData] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(CTF_URL);
        const data = await res.text();
        setURLData(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return { isLoading, urlData, error };
};
