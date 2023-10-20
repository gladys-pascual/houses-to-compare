import Link from 'next/link';
import { ModeToggle } from './ModeToggle';
import {
  LogoutLink,
  getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { ChevronDown, ArrowRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import MobileNav from './MobileNav';

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <nav className='sticky font-mono'>
      <div className='flex items-center justify-between p-10 lg:p-12'>
        {user && <MobileNav isAuth={!!user} />}
        <div className='hidden items-center space-x-10 sm:flex'>
          <Link href='/' legacyBehavior passHref>
            Home
          </Link>
          {user && (
            <Link href='/criteria' legacyBehavior passHref>
              Criteria
            </Link>
          )}
          {user && (
            <Link href='/houses' legacyBehavior passHref>
              Houses
            </Link>
          )}
        </div>

        <div className='flex items-center'>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='link' className='flex mr-8'>
                  <p className='pr-2'>Hi, {user.given_name} </p>
                  <ChevronDown className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <LogoutLink>Log out</LogoutLink>
                  <ArrowRight className='pl-2 h-5 w-5' />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
