import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import db from '@/db';
import Criteria from '@/components/Criteria';

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user || !user.id) redirect('/');

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect('/auth-callback');

  return <Criteria />;
}
