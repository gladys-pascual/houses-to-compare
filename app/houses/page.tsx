import Houses from '@/components/Houses';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import db from '@/db';

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

  return <Houses />;
}
