import React from "react";
import { Pagination } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination as PaginationType } from "@/services/types";

interface ReviewPaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  className?: string;
}

export const ReviewPagination: React.FC<ReviewPaginationProps> = ({
  pagination,
  onPageChange,
  className = "",
}) => {
  const { page, totalPages } = pagination;

  // Calculate hasNext and hasPrev based on current page and total pages
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  if (totalPages <= 1) {
    return null;
  }

  const renderPageItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={!hasPrev}
        onClick={() => hasPrev && onPageChange(page - 1)}
      >
        <ChevronLeft size={16} />
      </Pagination.Prev>
    );

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item
          key={1}
          active={page === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={page === i}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          active={page === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={!hasNext}
        onClick={() => hasNext && onPageChange(page + 1)}
      >
        <ChevronRight size={16} />
      </Pagination.Next>
    );

    return items;
  };

  return (
    <div
      className={`d-flex justify-content-center ${className}`}
      data-testid="pagination"
    >
      <Pagination className="mb-0 pagination-custom">
        {renderPageItems()}
      </Pagination>
    </div>
  );
};
