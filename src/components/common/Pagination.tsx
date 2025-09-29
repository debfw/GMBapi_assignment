import React from "react";
import { Pagination as BsPagination } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination as PaginationType } from "@/services/types";

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  className = "",
}) => {
  const { page, totalPages } = pagination;

  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  if (totalPages <= 1) {
    return null;
  }

  const renderPageItems = () => {
    const items = [] as React.ReactNode[];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    items.push(
      <BsPagination.Prev
        key="prev"
        disabled={!hasPrev}
        onClick={() => hasPrev && onPageChange(page - 1)}
      >
        <ChevronLeft size={16} />
      </BsPagination.Prev>
    );

    if (startPage > 1) {
      items.push(
        <BsPagination.Item
          key={1}
          active={page === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </BsPagination.Item>
      );
      if (startPage > 2) {
        items.push(<BsPagination.Ellipsis key="ellipsis-start" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <BsPagination.Item
          key={i}
          active={page === i}
          onClick={() => onPageChange(i)}
        >
          {i}
        </BsPagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<BsPagination.Ellipsis key="ellipsis-end" />);
      }
      items.push(
        <BsPagination.Item
          key={totalPages}
          active={page === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </BsPagination.Item>
      );
    }

    items.push(
      <BsPagination.Next
        key="next"
        disabled={!hasNext}
        onClick={() => hasNext && onPageChange(page + 1)}
      >
        <ChevronRight size={16} />
      </BsPagination.Next>
    );

    return items;
  };

  return (
    <div
      className={`d-flex justify-content-center ${className}`}
      data-testid="pagination"
    >
      <BsPagination className="mb-0 pagination-custom">
        {renderPageItems()}
      </BsPagination>
    </div>
  );
};
