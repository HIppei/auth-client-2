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

  syncWithCurrentSessionData({
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

  async isAlive(sessionData: { userName: string; idToken: string; accessToken: string; refreshToken: string }) {
    this.syncWithCurrentSessionData(sessionData);
    this.currentUser.getSession((err: Error) => {
      if (err) {
        console.log(err);
        return false;
      }
    });

    const isSessionAlive = await new Promise<boolean>((resolve) => {
      this.currentUser.getUserAttributes((err) => {
        if (err) {
          console.log(err);
          resolve(false);
        }
        resolve(true);
      });
    });

    return isSessionAlive;
  }

  async signOut(redirectToAuthServer: () => void) {
    await new Promise<void>((resolve) => {
      this.currentUser.globalSignOut({
        onSuccess() {
          resolve();
        },
        onFailure(err) {
          console.log(err);
          resolve();
        },
      });
    });

    redirectToAuthServer();
  }
}

const CognitoSession = new CognitoSessionClass();
export default CognitoSession;
