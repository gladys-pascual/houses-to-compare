import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div>
      <Skeleton className='mt-10 ml-20 mr-20 h-10 rounded-full' />
      <Skeleton className='mt-10 ml-20 mr-20 h-10 rounded-full' />
      <Skeleton className='mt-10 ml-20 mr-20 h-10 rounded-full' />
    </div>
  );
}
