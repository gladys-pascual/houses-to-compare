import { ModeToggle } from '@/components/ModeToggle';
import Onboarding from '@/components/Onboarding';

export default function Home() {
  return (
    <main className='px-24 py-16'>
      <header className='flex justify-end'>
        <ModeToggle />
      </header>
      <Onboarding />
    </main>
  );
}
