import Link from 'next/link';
import { ModeToggle } from './ModeToggle';
import {
  LogoutLink,
  getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server';

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <nav className='sticky font-mono'>
      <div className='flex items-center justify-between p-12'>
        <div className='items-center space-x-10'>
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
        <div className='flex justify column items-center space-x-10'>
          {user && <p>Hi, {user.given_name}!</p>}
          {user && <LogoutLink>Log out</LogoutLink>}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
