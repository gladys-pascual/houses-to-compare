'use client';
import { ArrowRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className='sm:hidden'>
      <Menu
        onClick={toggleOpen}
        className='relative z-50 h-5 w-5 text-zinc-700'
      />

      {isOpen ? (
        <div className='fixed font-sans animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full'>
          <ul className='absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-1 px-10 pt-20 pb-8'>
            {isAuth && (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/')}
                    className='flex items-center w-full font-semibold mt-8'
                    href='/'
                  >
                    Home
                  </Link>
                </li>
                <li className='my-3 h-px w-full bg-gray-300' />
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/criteria')}
                    className='flex items-center w-full font-semibold'
                    href='/criteria'
                  >
                    Criteria
                  </Link>
                </li>
                <li className='my-3 h-px w-full bg-gray-300' />
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/houses')}
                    className='flex items-center w-full font-semibold'
                    href='/houses'
                  >
                    Houses
                  </Link>
                </li>
                <li className='my-3 h-px w-full bg-gray-300' />
                <li className='flex'>
                  {/* <Link
                    className='flex items-center w-full font-semibold'
                    href='/sign-out'
                  >
                    Log out
                  </Link>
                  <ArrowRight className='pl-2 h-5 w-5' /> */}
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
