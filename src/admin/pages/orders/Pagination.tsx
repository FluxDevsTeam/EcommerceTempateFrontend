import { useState } from "react";

const Pagination = () => {
  const [activePage, setActivePage] = useState(1);
  const pages = [1, 2, 3, 4];

  return (
    <p className="flex border border-[#E0E0E0] rounded overflow-hidden">
      <span
        className="w-8 h-8 p-1 text-center flex items-center justify-center cursor-pointer"
        onClick={() => setActivePage(prev => Math.max(prev - 1, 1))}
      >
        &lt;
      </span>

      <span
        className="w-8 h-8 p-1 text-center flex items-center justify-center border-l border-[#E0E0E0] cursor-pointer"
        onClick={() => setActivePage(1)}
      >
        &lt;&lt;
      </span>

      {pages.map((page) => (
        <span
          key={page}
          className={`w-8 h-8 p-1 text-center flex items-center justify-center border-l border-[#E0E0E0] cursor-pointer ${
            activePage === page ? "bg-[#184455] text-white" : ""
          }`}
          onClick={() => setActivePage(page)}
        >
          {page}
        </span>
      ))}

      <span className="w-8 h-8 p-1 text-center flex items-center justify-center border-l border-[#E0E0E0]">...</span>

      <span
        className="w-8 h-8 p-1 text-center flex items-center justify-center border-l border-[#E0E0E0] cursor-pointer"
        onClick={() => setActivePage(prev => Math.min(prev + 1, pages.length))}
      >
        &gt;
      </span>

      <span
        className="w-8 h-8 p-1 text-center flex items-center justify-center border-l border-[#E0E0E0] rounded-r cursor-pointer"
        onClick={() => setActivePage(pages.length)}
      >
        &gt;&gt;
      </span>
    </p>
  );
};

export default Pagination;
