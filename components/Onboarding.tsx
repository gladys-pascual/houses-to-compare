import db from '@/db';
import { Ghost } from 'lucide-react';
import CreateCriterion from './CreateCriterion/CreateCriterion';
import CriteriaList from './CriteriaList';
export default async function Onboarding() {
  const userId = 1;

  // // make database call
  const criteria = await db.criteria.findFirst({
    where: {
      userId,
    },
    include: {
      criterion: true,
    },
  });

  const criterion = criteria?.criterion;

  const isCriteriaEmpty = !criterion?.length;

  const NoCriteria = () => (
    <div className='mt-16 flex flex-col items-center gap-2'>
      <Ghost className='h-8 w-8 text-zinc-800' />
      <h3 className='font-semibold text-xl'>Pretty empty around here</h3>{' '}
      <p>Let&apos;s change that</p>
      <CreateCriterion isCriteriaEmpty={isCriteriaEmpty} />
    </div>
  );

  return (
    <div>
      <h1 className='font-mono text-2xl pb-4'>onboarding</h1>
      <h2 className='pb-16'>Description, how it works</h2>
      {isCriteriaEmpty ? (
        <NoCriteria />
      ) : (
        <CriteriaList criterion={criterion} />
      )}
    </div>
  );
}
