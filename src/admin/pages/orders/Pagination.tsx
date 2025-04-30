import { Link } from "react-router-dom";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

  const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className='flex justify-between items-center px-6 sm:px-24 mt-20'>
      <p className="flex border border-[#E0E0E0] rounded overflow-hidden">
        <span
          className="w-8 h-8 p-1 text-center flex items-center justify-center cursor-pointer"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        >
          &lt;
        </span>

        <span
          className="w-8 h-8 p-1 text-center flex items-center justify-center border-l border-[#E0E0E0] cursor-pointer"
          onClick={() => onPageChange(1)}
        >
          &lt;&lt;
        </span>

        {pages.map((page) => (
          <span
            key={page}
            className={`w-8 h-8 p-1 text-center flex items-center justify-center border-l border-[#E0E0E0] cursor-pointer ${
              currentPage === page ? "bg-[#184455] text-white" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </span>
        ))}

        <span className="w-8 h-8 p-1 text-center flex items-center justify-center border-l border-[#E0E0E0]">...</span>

        <span
          className="w-8 h-8 p-1 text-center flex items-center justify-center border-l border-[#E0E0E0] cursor-pointer"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        >
          &gt;
        </span>

        <span
          className="w-8 h-8 p-1 text-center flex items-center justify-center border-l border-[#E0E0E0] rounded-r cursor-pointer"
          onClick={() => onPageChange(totalPages)}
        >
          &gt;&gt;
        </span>
      </p>

      <Link
        to={""}
        className='text-[#184455] font-semibold'
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      >
        Next
      </Link>
    </div>
  );
};

export default Pagination;
