interface IPageNavigation {
  page: number;
  onPageChange: (page: number) => void;
  totalPages: number | undefined;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}
export const PageNavigation = (props: IPageNavigation) => {
  const { page, onPageChange, totalPages, pageSize, onPageSizeChange } = props;
  if (!totalPages) return <div>No pages</div>;
  return (
    <div style={{ display: "flex" }}>
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      <span>
        Page: {page} out of {totalPages}
      </span>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
      >
        {[5, 10, 15].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};
