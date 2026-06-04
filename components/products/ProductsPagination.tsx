import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type PaginationDemoProps = {
  currentPage: number
  totalPages: number
  search?: string
  layout?: string
}

export function ProductsPagination({
  currentPage,
  totalPages,
  search = '',
  layout = 'grid',
}: PaginationDemoProps) {
  // Costruisce l'URL di UNA pagina mantenendo layout e search correnti.
  const buildHref = (page: number) => {
    const params = new URLSearchParams()
    params.set('layout', layout)
    if (search) params.set('search', search)
    if (page > 1) params.set('page', String(page)) // page=1 è l'URL "pulito"
    return `/products?${params.toString()}`
  }

  // Decidiamo QUALI numeri mostrare. Con poche pagine: tutte.
  // Con tante: prima pagina, "…", finestra attorno alla corrente, "…", ultima.
  const pageNumbers: Array<number | 'ellipsis'> = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) pageNumbers.push(i)
  } else {
    pageNumbers.push(1) // mostra SEMPRE la prima

    if (currentPage > 3) pageNumbers.push('ellipsis') // gap a sinistra

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let page = start; page <= end; page += 1) pageNumbers.push(page)

    if (currentPage < totalPages - 2) pageNumbers.push('ellipsis') // gap a destra

    pageNumbers.push(totalPages) // mostra SEMPRE l'ultima
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* PRECEDENTE: non scende mai sotto 1 */}
        <PaginationItem>
          <PaginationPrevious href={buildHref(Math.max(1, currentPage - 1))} />
        </PaginationItem>

        {/* NUMERI o puntini */}
        {pageNumbers.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={buildHref(page)}
                isActive={page === currentPage} // evidenzia la pagina corrente
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* SUCCESSIVA: non supera mai totalPages */}
        <PaginationItem>
          <PaginationNext
            href={buildHref(Math.min(totalPages, currentPage + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
