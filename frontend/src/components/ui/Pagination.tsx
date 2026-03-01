import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface PaginationProps {
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;

  const changePage = (page: number) => {
    navigate(`?page=${page}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-orange-100"
      >
        ←
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 2
          ) {
            return true;
          }
          return false;
        })
        .map((page, index, arr) => {
          const prevPage = arr[index - 1];

          return (
            <div key={page} className="flex items-center">
              {prevPage && page - prevPage > 1 && (
                <span className="px-2">...</span>
              )}

              <button
                onClick={() => changePage(page)}
                className={`px-3 py-1 rounded border transition ${
                  currentPage === page
                    ? "bg-orange-500 text-white border-orange-500"
                    : "hover:bg-orange-100"
                }`}
              >
                {page}
              </button>
            </div>
          );
        })}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
        className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-orange-100"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
