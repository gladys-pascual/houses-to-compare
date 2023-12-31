'use client';

import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const Page = () => {
  const router = useRouter();

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        router.push('/criteria');
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push('/api/auth/login');
      }
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3 className='font-semibold text-xl'>Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
