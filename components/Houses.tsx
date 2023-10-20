'use client';

import HousesTable from './HousesTable';
import { Ghost } from 'lucide-react';
import CreateHouseWithScore from './CreateHouseWithScore';
import Link from 'next/link';
import { trpc } from '@/app/_trpc/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function Houses() {
  const {
    data: criteria,
    isLoading: isLoadingCriteria,
    isError: isErrorCriteria,
  } = trpc.getCriteria.useQuery();

  const {
    data: criterionScores,
    isLoading: isLoadingCriterionScores,
    isError: isErrorCriterionScores,
  } = trpc.getCriterionScores.useQuery();

  const {
    data: housesScore,
    isLoading: isLoadingHousesScore,
    isError: isErrorHousesScore,
  } = trpc.getHousesScore.useQuery();

  const isLoading =
    isLoadingCriteria || isLoadingCriterionScores || isLoadingHousesScore;
  const isError =
    isErrorCriteria || isErrorCriterionScores || isErrorHousesScore;

  const isCriterionScoresEmpty = !criterionScores?.length;
  const isCriteriaEmpty = !criteria?.criterion.length;

  const NoHouse = () => (
    <div className='flex flex-col items-center gap-4 h-screen content-center pt-40'>
      {isCriteriaEmpty ? (
        <>
          <Ghost className='h-8 w-8 text-zinc-800' />
          <h3 className='font-semibold text-xl'>
            You don&apos;t have a criteria to rate your house yet
          </h3>
          <span>
            <Link href='/criteria' className='text-blue-600 hover:underline'>
              Go to criteria
            </Link>{' '}
            to create the first one
          </span>
        </>
      ) : (
        <>
          <Ghost className='h-8 w-8 text-zinc-800' />
          <h3 className='font-semibold text-xl'>
            You haven&apos;t rated any house yet
          </h3>
          <p>Let&apos;s change that</p>
          <CreateHouseWithScore
            criteriaList={criteria?.criterion}
            isEmpty={isCriterionScoresEmpty}
          />
        </>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div>
        <Skeleton className='mt-10 ml-20 mr-20 h-10 rounded-full' />
        <Skeleton className='mt-10 ml-20 mr-20 h-10 rounded-full' />
        <Skeleton className='mt-10 ml-20 mr-20 h-10 rounded-full' />
      </div>
    );
  }

  // todo: have nicer error state
  if (isError) {
    return <h1>Something went wrong, please try again </h1>;
  }

  return (
    <div className='container'>
      {!isCriteriaEmpty && !isCriterionScoresEmpty && (
        <h1 className='font-mono text-xl pb-4'>Houses</h1>
      )}
      {isCriterionScoresEmpty ? (
        <NoHouse />
      ) : (
        housesScore &&
        criteria && (
          <>
            <CreateHouseWithScore
              criteriaList={criteria.criterion}
              isEmpty={isCriterionScoresEmpty}
            />
            <HousesTable housesScore={housesScore} />
          </>
        )
      )}
    </div>
  );
}
