import { useState } from 'react';

const URL_BASE = 'https://api.nationalize.io/?name=nathaniel';

interface IJsonInput {
  convertToJson: (valueToConvert: string) => void;
  handleAPIJson: (value: unknown) => void;
}

interface IJsonNode {
  data: unknown;
  level?: number;
}

export const JsonInput = (props: IJsonInput) => {
  const { convertToJson, handleAPIJson } = props;
  const [value, setValue] = useState('');
  const [isPending, setIsPending] = useState(false);

  const fetchData = async () => {
    setIsPending(true);
    try {
      const response = await fetch(URL_BASE);
      if (!response.ok) {
        throw new Error('Errors on fetch');
      }
      const data = await response.json();
      handleAPIJson(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <textarea
        style={{ width: '100%', height: '300px' }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => {
          convertToJson(value);
        }}
      >
        Convert to JSON
      </button>
      <button onClick={fetchData}>
        {isPending ? 'Loading...' : 'Pull Data from API'}
      </button>
    </div>
  );
};

export const JsonNode = (props: IJsonNode) => {
  const { data, level = 0 } = props;
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  if (typeof data !== 'object' || data === null) {
    return <span>{JSON.stringify(data)}</span>;
  }

  const keys = Object.keys(data);

  return (
    <div style={{ marginLeft: level * 10 }}>
      <button onClick={() => setIsCollapsed((prev) => !prev)}>
        {isCollapsed ? '+' : '-'}
      </button>
      {keys.map((key) => {
        return (
          <div key={key}>
            {!isCollapsed ? (
              <div>
                <strong>{key}:</strong>{' '}
                <JsonNode
                  data={(data as Record<string, unknown>)[key]}
                  level={level + 1}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export function JsonViewer() {
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [errors, setErrors] = useState('');

  const convertToJson = (valueToConvert: string) => {
    try {
      const parsedData = JSON.parse(valueToConvert);
      setParsedJson(parsedData);
      setErrors('');
    } catch {
      setErrors('Wrong format');
      setParsedJson(null);
    }
  };

  return (
    <div className='App'>
      <JsonInput
        convertToJson={convertToJson}
        handleAPIJson={(value: unknown) => {
          setParsedJson(value);
        }}
      />
      {parsedJson != null && <JsonNode data={parsedJson} />}
      {errors && <div style={{ color: 'red' }}>{errors}</div>}
    </div>
  );
}
