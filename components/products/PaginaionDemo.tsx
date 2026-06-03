import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationDemoProps = {
  currentPage: number;
  totalPages: number;
  search?: string;
  layout?: string;
};

export function PaginationDemo({
  currentPage,
  totalPages,
  search = "",
  layout = "grid",
}: PaginationDemoProps) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    params.set("layout", layout);
    if (search) params.set("search", search);
    if (page > 1) params.set("page", String(page));
    return `/products?${params.toString()}`;
  };

  const pageNumbers: Array<number | "ellipsis"> = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let page = start; page <= end; page += 1) {
      pageNumbers.push(page);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push("ellipsis");
    }

    pageNumbers.push(totalPages);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={buildHref(Math.max(1, currentPage - 1))} />
        </PaginationItem>
        {pageNumbers.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={buildHref(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={buildHref(Math.min(totalPages, currentPage + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
