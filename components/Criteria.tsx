import db from '@/db';
import { Ghost } from 'lucide-react';
import CreateCriterion from './CreateCriterion';
import CriteriaTable from './CriteriaTable';

export default async function Criteria() {
  const userId = 1;

  // // make database call to get criteria
  const criteria = await db.criteria.findFirst({
    where: {
      userId,
    },
    include: {
      criterion: true,
    },
  });

  const criterionList = criteria?.criterion;
  // const isCriteriaEmpty = true;
  const isCriteriaEmpty = !criterionList?.length;

  const NoCriteria = () => (
    <div className='flex flex-col items-center gap-4 h-screen content-center'>
      <Ghost className='h-8 w-8 text-zinc-800' />
      <h3 className='font-semibold text-xl'>Pretty empty around here</h3>{' '}
      <p>Let&apos;s change that</p>
      <CreateCriterion isCriteriaEmpty={isCriteriaEmpty} />
    </div>
  );

  return (
    <div className='container'>
      <h1 className='font-mono text-xl pb-4'>Criteria</h1>
      {/* <h2 className='pb-10'>
        List of your predefined criteria, which will be used to rank your houses
      </h2> */}
      {isCriteriaEmpty ? (
        <NoCriteria />
      ) : (
        <CriteriaTable criterionList={criterionList} />
      )}
    </div>
  );
}
