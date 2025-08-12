import React from "react";

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
  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    if (currentPage > 2) {
      pages.push(1);
    }
    
    // Show current page and adjacent pages
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // Always show last page
    if (currentPage < totalPages - 1 && totalPages > 1) {
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-6 mb-4">
      <div className="flex justify-center items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => hasPreviousPage && handlePageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {/* Page numbers */}
        <div className="flex items-center">
          {pageNumbers.map((page, index) => {
            // Show ellipsis when there's a gap
            if (index > 0 && pageNumbers[index - 1] !== page - 1) {
              return (
                <React.Fragment key={`ellipsis-${page}`}>
                  <span className="px-2">...</span>
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 mx-1 flex items-center justify-center rounded-md ${
                      currentPage === page
                        ? "bg-neutral-900 text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            }
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 mx-1 flex items-center justify-center rounded-md ${
                  currentPage === page
                    ? "bg-neutral-900 text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        {/* Next button */}
        <button
          onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;