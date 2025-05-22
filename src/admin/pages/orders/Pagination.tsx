import { formatNumberWithCommas } from "../../utils/formatting";

type PaginationProps = {
  nextPageUrl: string | null;
  prevPageUrl: string | null;
  getPageUrl: (page: number) => string;
  totalPages: number;
  currentPage: number;
  onPageChange: (url: string) => void;
};

const getPageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const maxVisibleButtons = 5; // Max number of page buttons to show (excluding prev/next)
  const pageNumbers: (number | string)[] = [];

  if (totalPages <= maxVisibleButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
      }
    }
    
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
  }
  return pageNumbers;
};


const Pagination = ({ nextPageUrl, currentPage, totalPages, getPageUrl, prevPageUrl, onPageChange }: PaginationProps) => {
  const pages = getPageNumbers(currentPage, totalPages);

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or no pages
  }

  const commonButtonStyles = "h-9 w-9 flex items-center justify-center border border-gray-300 text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";
  const activePageStyles = "bg-blue-500 border-blue-500 text-white hover:bg-blue-600";
  const inactivePageStyles = "bg-white text-gray-700 hover:bg-gray-50";
  const disabledStyles = "opacity-50 cursor-not-allowed bg-gray-100";

  return (
    <div className='flex justify-center items-center mt-8 mb-4'>
      <nav className="flex items-center space-x-1">
        {/* First Page Button */}
        <button
          title="First page"
          className={`${commonButtonStyles} rounded-l-md ${currentPage === 1 ? disabledStyles : inactivePageStyles}`}
          onClick={() => currentPage !== 1 && onPageChange(getPageUrl(1))}
          disabled={currentPage === 1}
        >
          &lt;&lt;
        </button>
        {/* Previous Page Button */}
        <button
          title="Previous page"
          className={`${commonButtonStyles} ${!prevPageUrl ? disabledStyles : inactivePageStyles}`}
          onClick={() => prevPageUrl && onPageChange(prevPageUrl)}
          disabled={!prevPageUrl}
        >
          &lt;
        </button>

        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className={`${commonButtonStyles} border-none text-gray-500`}>
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              className={`${commonButtonStyles} ${page === currentPage ? activePageStyles : inactivePageStyles}`}
              onClick={() => page !== currentPage && onPageChange(getPageUrl(page as number))}
              disabled={page === currentPage}
            >
              {formatNumberWithCommas(page as number)}
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          title="Next page"
          className={`${commonButtonStyles} ${!nextPageUrl ? disabledStyles : inactivePageStyles}`}
          onClick={() => nextPageUrl && onPageChange(nextPageUrl)}
          disabled={!nextPageUrl}
        >
          &gt;
        </button>
        {/* Last Page Button */}
        <button
          title="Last page"
          className={`${commonButtonStyles} rounded-r-md ${currentPage === totalPages ? disabledStyles : inactivePageStyles}`}
          onClick={() => currentPage !== totalPages && onPageChange(getPageUrl(totalPages))}
          disabled={currentPage === totalPages}
        >
          &gt;&gt;
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
