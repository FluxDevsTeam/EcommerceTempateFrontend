type PaginationProps = {
  nextPageUrl: string | null;
  prevPageUrl: string | null;
  getPageUrl: (page: number) => string;
  totalPages: number;
  currentPage: number;
  onPageChange: (url: string) => void;
};

const getPageNumbers = (currentPage: number, totalPages: number): number[] => {
  const maxVisible = totalPages;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
};


const Pagination = ({ nextPageUrl, currentPage, totalPages, getPageUrl, prevPageUrl, onPageChange }: PaginationProps) => {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className='flex justify-between items-center px-6 sm:px-24 mt-20'>
      <div className="flex border border-[#E0E0E0] rounded overflow-hidden">
        <button
          className="w-8 h-8 border-r border-[#E0E0E0] cursor-pointer disabled:opacity-30"
          onClick={() => prevPageUrl && onPageChange(getPageUrl(1))}
          disabled={!prevPageUrl}
        >
          &lt;&lt;
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center cursor-pointer disabled:opacity-30"
          onClick={() => prevPageUrl && onPageChange(prevPageUrl)}
          disabled={!prevPageUrl}
        >
          &lt;
        </button>

          {pages.map((page) => (
          <button
            key={page}
            className={`px-2 py-1 rounded ${page === currentPage ? 'bg-[#184455] text-white font-bold' : 'text-[#184455]'}`}
            onClick={() => onPageChange(getPageUrl(page))}
          >
            {page}
          </button>
        ))}

        <button
          className="w-8 h-8 flex items-center justify-center border-l border-[#E0E0E0] cursor-pointer disabled:opacity-30"
          onClick={() => nextPageUrl && onPageChange(nextPageUrl)}
          disabled={!nextPageUrl}
        >
          &gt;
        </button>
        <button
          className="w-8 h-8 border-l border-[#E0E0E0] cursor-pointer disabled:opacity-30"
          onClick={() => onPageChange(getPageUrl(totalPages))}
          disabled={currentPage === totalPages}
        >
          &gt;&gt;
        </button>
      </div>

      <button
        className='text-[#184455] font-semibold disabled:opacity-30'
        onClick={() => nextPageUrl && onPageChange(nextPageUrl)}
        disabled={!nextPageUrl}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
