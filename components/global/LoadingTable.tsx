import { Skeleton } from "../ui/skeleton";

function LoadingTable({ rows = 5 }: { rows?: number }) {
  const tableRows = Array.from({ length: rows }, (_, index) => {
    // (value, index)
    return (
      <div className="mb-4" key={index}>
        <Skeleton className="w-full h-8 rounded" />
      </div>
    );
  });
  return <>{tableRows}</>;
}
export default LoadingTable;

/** 
 * Array.from({ length: 5 })
 *[undefined, undefined, undefined, undefined, undefined]
 *
 * 
 * Array.from({ length: 5 }, (value, index) => {
//                             ↑       ↑
//                        undefined   0,1,2,3,4
});
 * 
 * 
 * Array.from({ length: 5 }, (_, index) => {
  return <Skeleton key={index} />;
});
// → [<Skeleton/>, <Skeleton/>, <Skeleton/>, <Skeleton/>, <Skeleton/>]
 * 
 * 
 */
