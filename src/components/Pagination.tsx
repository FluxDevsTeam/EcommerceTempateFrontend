import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  handlePageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  handlePageChange,
}) => {
  const getPageNumbers = () => {
    const pages = new Set<number>();

    // Always show first and last
    pages.add(1);
    if (currentPage > 2) pages.add(currentPage - 1);
    pages.add(currentPage);
    if (currentPage < totalPages - 1) pages.add(currentPage + 1);
    pages.add(totalPages);

    return [...pages].sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-2 mt-6 mb-4">
      <button
        onClick={() => hasPreviousPage && handlePageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {pageNumbers.map((page, idx, arr) => {
        const isEllipsis =
          idx > 0 && page - arr[idx - 1] > 1;

        return (
          <React.Fragment key={page}>
            {isEllipsis && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 mx-1 flex items-center justify-center rounded-md ${
                currentPage === page
                  ? 'bg-neutral-900 text-white'
                  : 'border hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;
