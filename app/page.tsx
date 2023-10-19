import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        user && `mt-20`
      }`}
    >
      <h1 className='max-w-4xl  text-2xl font-bold md:text-3xl lg:text-4xl tracking-widest'>
        Houses to Compare
      </h1>
      <h2 className='max-w-3xl text-2xl md:text-3xl lg:text-4xl mt-8 mb-20 '>
        Remove the burden of <span className='italic'>decision fatigue</span>{' '}
        and focus getting your{' '}
        <span className='text-purple-600'>dream home</span>
      </h2>
      <ul className='ml-12 mr-12 text-m md:text-l lg:text-xl space-y-2'>
        <li>
          Step 1:{' '}
          {user ? (
            <Link href='/criteria' className='text-blue-600 hover:underline'>
              Create your criteria
            </Link>
          ) : (
            'Create your criteria'
          )}{' '}
          and set the weight it carries
        </li>
        <li>
          Step 2: For each potential house,{' '}
          {user ? (
            <Link href='/houses' className='text-blue-600 hover:underline'>
              enter a rating
            </Link>
          ) : (
            'enter a rating'
          )}{' '}
          per predefined criteria
        </li>
      </ul>

      {!user && (
        <>
          <div className='mt-12'>
            <p className='mb-2'>Create an account to get started</p>
            <RegisterLink
              className={buttonVariants({
                size: 'lg',
              })}
            >
              Sign up
              <ArrowRight className='ml-1.5 h-5 w-5' />
            </RegisterLink>
          </div>
          <div className='mt-8'>
            <p className='mb-2'>Been here before?</p>
            <LoginLink
              className={buttonVariants({
                variant: 'secondary',
                size: 'lg',
              })}
            >
              Log in
            </LoginLink>
          </div>
        </>
      )}
    </div>
  );
}
