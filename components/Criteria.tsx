import db from '@/db';
import { Ghost } from 'lucide-react';
import CreateCriterion from './CreateCriterion';
import CriteriaTable from './CriteriaTable';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';

export default async function Criteria() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const criteria = await db.criteria.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      criterion: true,
    },
  });

  const criterionList = criteria?.criterion;
  const isCriteriaEmpty = !criterionList?.length;

  const NoCriteria = () => (
    <div className='flex flex-col items-center gap-4 h-screen content-center pt-40'>
      <Ghost className='h-8 w-8 text-zinc-800' />
      <h3 className='font-semibold text-xl'>Pretty empty around here</h3>{' '}
      <p>Let&apos;s change that</p>
      <CreateCriterion isCriteriaEmpty={isCriteriaEmpty} />
    </div>
  );

  return (
    <div className='container'>
      {!isCriteriaEmpty && <h1 className='font-mono text-xl pb-4'>Criteria</h1>}
      {isCriteriaEmpty ? (
        <NoCriteria />
      ) : (
        <>
          <CriteriaTable criterionList={criterionList} />
          <p className='pl-4 pt-8 text-slate-600'>
            Once your criteria are set, let's start{' '}
            <Link href='/houses' className='text-blue-600 hover:underline'>
              rating houses
            </Link>
            !
          </p>
        </>
      )}
    </div>
  );
}
