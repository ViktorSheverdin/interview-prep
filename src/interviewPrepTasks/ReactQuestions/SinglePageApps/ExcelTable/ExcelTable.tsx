import { useEffect, useState } from 'react';

interface TableData {
  id: number;
  name: string;
  age: string;
  height: string;
}

const initialTableData: TableData[] = [
  { id: 1, name: 'Viktor', age: '26', height: '180' },
  { id: 2, name: 'Alice', age: '28', height: '165' },
  { id: 3, name: 'Bob', age: '40', height: '185' },
];

const LOCAL_STORAGE_KEY = 'excelTableData';

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
  margin: '1rem 0',
};

const cellStyle: React.CSSProperties = {
  border: '1px solid black',
  padding: '8px',
  textAlign: 'left',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '6px',
  border: 'none',
  outline: '2px solid blue', // Highlight the active input
};

const deleteButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'red',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
};

interface EditableCellProps {
  initialValue: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onUpdate: (newValue: string) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  initialValue,
  isEditing,
  onStartEdit,
  onUpdate,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    onUpdate(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onUpdate(value);
    }
  };

  return (
    <td
      style={cellStyle}
      onClick={onStartEdit}
    >
      {isEditing ? (
        <input
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          autoFocus
        />
      ) : (
        initialValue
      )}
    </td>
  );
};

export const ExcelTable = () => {
  const [tableData, setTableData] = useState<TableData[]>(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : initialTableData;
  });

  // State to track the currently editing cell's coordinates
  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    cellName: keyof Omit<TableData, 'id'>;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableData));
  }, [tableData]);

  const handleStartEdit = (
    rowId: number,
    cellName: keyof Omit<TableData, 'id'>
  ) => {
    setEditingCell({ rowId, cellName });
  };

  const handleCellUpdate = (
    rowId: number,
    cellName: keyof Omit<TableData, 'id'>,
    newValue: string
  ) => {
    setTableData(
      tableData.map((row) => {
        if (row.id === rowId) {
          return { ...row, [cellName]: newValue };
        }
        return row;
      })
    );
    setEditingCell(null); // Finish editing
  };

  const handleDelete = (id: number) => {
    setTableData(tableData.filter((row) => row.id !== id));
  };

  const handleAddRow = () => {
    const newId =
      tableData.length > 0 ? Math.max(...tableData.map((r) => r.id)) + 1 : 1;
    const newRow: TableData = {
      id: newId,
      name: '',
      age: '',
      height: '',
    };
    setTableData([...tableData, newRow]);
  };

  return (
    <div>
      <h1>Excel Table</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...cellStyle, width: '50px' }}></th>{' '}
            {/* Delete column */}
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Age</th>
            <th style={cellStyle}>Height</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td style={cellStyle}>
                <button
                  style={deleteButtonStyle}
                  onClick={() => handleDelete(row.id)}
                >
                  X
                </button>
              </td>
              <EditableCell
                initialValue={row.name}
                isEditing={
                  editingCell?.rowId === row.id &&
                  editingCell?.cellName === 'name'
                }
                onStartEdit={() => handleStartEdit(row.id, 'name')}
                onUpdate={(newValue) =>
                  handleCellUpdate(row.id, 'name', newValue)
                }
              />
              <EditableCell
                initialValue={row.age}
                isEditing={
                  editingCell?.rowId === row.id &&
                  editingCell?.cellName === 'age'
                }
                onStartEdit={() => handleStartEdit(row.id, 'age')}
                onUpdate={(newValue) =>
                  handleCellUpdate(row.id, 'age', newValue)
                }
              />
              <EditableCell
                initialValue={row.height}
                isEditing={
                  editingCell?.rowId === row.id &&
                  editingCell?.cellName === 'height'
                }
                onStartEdit={() => handleStartEdit(row.id, 'height')}
                onUpdate={(newValue) =>
                  handleCellUpdate(row.id, 'height', newValue)
                }
              />
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddRow}
        style={{ marginTop: '1rem' }}
      >
        Add Empty Row
      </button>
    </div>
  );
};
