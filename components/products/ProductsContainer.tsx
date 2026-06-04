import ProductsGrid from './ProductsGrid'
import ProductsList from './ProductsList'
import { LuLayoutGrid, LuList } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  fetchAllProducts,
  fetchAllProductsWithPagination,
} from '@/utils/actions'
import Link from 'next/link'
import { PaginationDemo } from './PaginaionDemo'
import { ProductsPagination } from './ProductsPagination'

async function ProductsContainer({
  layout,
  search,
  page = 1,
}: {
  layout: string
  search: string
  page?: number
}) {
  const limit = 9
  const { products, total } = await fetchAllProductsWithPagination({
    search,
    page,
    limit,
  })
  const totalPages = Math.max(Math.ceil(total / limit), 1)
  const buildLayoutHref = (newLayout: string) => {
    const params = new URLSearchParams()
    params.set('layout', newLayout)
    if (search) params.set('search', search)
    if (page > 1) params.set('page', String(page))
    return `/products?${params.toString()}`
  }
  const totalProducts = products.length
  const searchTerm = search ? `&search=${search}` : ''
  return (
    <>
      {/* HEADER */}
      <section>
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-lg">
            {total} product{total !== 1 && 's'}
          </h4>
          <div className="flex gap-x-4">
            <Button
              variant={layout === 'grid' ? 'default' : 'ghost'}
              size="icon"
              asChild
            >
              <Link href={buildLayoutHref('grid')}>
                <LuLayoutGrid />
              </Link>
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'ghost'}
              size="icon"
              asChild
            >
              <Link href={buildLayoutHref('list')}>
                <LuList />
              </Link>
            </Button>
          </div>
        </div>
        <Separator className="mt-4" />
      </section>
      {/* PRODUCTS */}
      <div>
        {totalProducts === 0 ? (
          <h5 className="text-2xl mt-16">
            Sorry, no products matched your search...
          </h5>
        ) : layout === 'grid' ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-12">
          <ProductsPagination
            currentPage={page}
            totalPages={totalPages}
            layout={layout}
            search={search}
          />
        </div>
      )}
    </>
  )
}
export default ProductsContainer
