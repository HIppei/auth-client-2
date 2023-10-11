'use client';

import CognitoSession from '@/sessions/cognito-session';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { push } = useRouter();

  const checkSession = async () => {
    (await CognitoSession.isAlive()) ? console.log('Alive') : push('/login');
  };

  return (
    <>
      <div>Client application</div>
      <button onClick={checkSession}>Session check</button>
      <button onClick={() => CognitoSession.signOut(() => push('/login'))}>Sign out</button>
    </>
  );
}
