import { useEffect, useState } from 'react';

// Interfaces, constants, and styles remain the same
interface TableData {
  id: number;
  name: string;
  age: string;
  height: string;
}

type TableColumn = keyof Omit<TableData, 'id'>;

const initialTableData: TableData[] = [
  { id: 1, name: 'Viktor', age: '26', height: '180' },
  { id: 2, name: 'Alice', age: '28', height: '165' },
  { id: 3, name: 'Bob', age: '40', height: '185' },
];

const LOCAL_STORAGE_KEY = 'excelTableData';

const columns: TableColumn[] = ['name', 'age', 'height'];

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
  margin: '1rem 0',
};

const cellStyle: React.CSSProperties = {
  border: '1px solid black',
  padding: 0,
  textAlign: 'left',
};

const cellWrapperStyle: React.CSSProperties = {
  padding: '8px',
  minHeight: '22px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 0,
  border: 'none',
  outline: '2px solid blue',
  font: 'inherit',
  background: 'transparent',
};

const deleteButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'red',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
};

// EditableCell component remains the same
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
      <div style={cellWrapperStyle}>
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
      </div>
    </td>
  );
};

export const ExcelTable = () => {
  // All state and handler functions remain the same
  const [tableData, setTableData] = useState<TableData[]>(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : initialTableData;
  });

  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    cellName: TableColumn;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableData));
  }, [tableData]);

  const handleStartEdit = (rowId: number, cellName: TableColumn) => {
    setEditingCell({ rowId, cellName });
  };

  const handleCellUpdate = (
    rowId: number,
    cellName: TableColumn,
    newValue: string
  ) => {
    setTableData(
      tableData.map((row) =>
        row.id === rowId ? { ...row, [cellName]: newValue } : row
      )
    );
    setEditingCell(null);
  };

  const handleDelete = (id: number) => {
    setTableData(tableData.filter((row) => row.id !== id));
  };

  const handleAddRow = () => {
    const newId =
      tableData.length > 0 ? Math.max(...tableData.map((r) => r.id)) + 1 : 1;
    const newRow: TableData = { id: newId, name: '', age: '', height: '' };
    setTableData([...tableData, newRow]);
  };

  return (
    <div>
      <h1>Excel Table</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...cellStyle, width: '50px' }}>
              {/* <div style={cellWrapperStyle}>&nbsp;</div> */}
            </th>
            {columns.map((column) => (
              <th
                key={column}
                style={{ ...cellStyle, textTransform: 'capitalize' }}
              >
                <div style={cellWrapperStyle}>{column}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td style={cellStyle}>
                <div style={cellWrapperStyle}>
                  <button
                    style={deleteButtonStyle}
                    onClick={() => handleDelete(row.id)}
                  >
                    X
                  </button>
                </div>
              </td>
              {/* Dynamically render cells by looping through the columns array */}
              {columns.map((column) => (
                <EditableCell
                  key={column}
                  initialValue={row[column]}
                  isEditing={
                    editingCell?.rowId === row.id &&
                    editingCell?.cellName === column
                  }
                  onStartEdit={() => handleStartEdit(row.id, column)}
                  onUpdate={(newValue) =>
                    handleCellUpdate(row.id, column, newValue)
                  }
                />
              ))}
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
