import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PaginationProps {
  last: boolean
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ totalPages, onPageChange, last }: PaginationProps) => {
  const [currentPage,setCurrentPage] = useState(1)
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      setCurrentPage(currentPage - 1)
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      setCurrentPage(currentPage + 1)
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="h-10 w-10 rounded-full transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center justify-center min-w-[80px] h-10 px-4 rounded-full bg-secondary text-secondary-foreground font-medium">
        {currentPage} / {totalPages}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages || last}
        className="h-10 w-10 rounded-full transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
