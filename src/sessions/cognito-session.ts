import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

class CognitoSessionClass {
  userPool = new CognitoUserPool({
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
    ClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID as string,
  });
  currentUser = new CognitoUser({ Username: '', Pool: this.userPool });

  store({
    userName,
    idToken,
    accessToken,
    refreshToken,
  }: {
    userName: string;
    idToken: string;
    accessToken: string;
    refreshToken: string;
  }) {
    const session = new CognitoUserSession({
      IdToken: new CognitoIdToken({ IdToken: idToken }),
      AccessToken: new CognitoAccessToken({ AccessToken: accessToken }),
      RefreshToken: new CognitoRefreshToken({ RefreshToken: refreshToken }),
    });

    this.currentUser = new CognitoUser({ Username: userName, Pool: this.userPool });
    this.currentUser.setSignInUserSession(session);
  }

  async isAlive() {
    await 



  }

  signOut(redirectToAuthServer: () => void) {


  }
}

const CognitoSession = new CognitoSessionClass();
export default CognitoSession;
