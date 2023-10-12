'use client';

import CognitoSession from '@/sessions/cognito-session';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { push } = useRouter();

  const checkSession = async () => {
    const keyPrefix = `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID}`;
    const userName = localStorage.getItem(`${keyPrefix}.LastAuthUser`) ?? '';
    const idToken = localStorage.getItem(`${keyPrefix}.${userName}.idToken`) ?? '';
    const accessToken = localStorage.getItem(`${keyPrefix}.${userName}.accessToken`) ?? '';
    const refreshToken = localStorage.getItem(`${keyPrefix}.${userName}.refreshToken`) ?? '';

    (await CognitoSession.isAlive({ userName, idToken, accessToken, refreshToken }))
      ? console.log('Alive')
      : push('/login');
  };

  return (
    <>
      <div>Client application</div>
      <button onClick={checkSession}>Session check</button>
      <button onClick={async () => await CognitoSession.signOut(() => push('/login'))}>Sign out</button>
    </>
  );
}
