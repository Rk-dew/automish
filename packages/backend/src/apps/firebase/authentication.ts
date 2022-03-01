import type {
  IAuthentication,
  IApp,
  IField,
  IJSONObject,
} from '@automatisch/types';
import { google as GoogleApi } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: OAuth2Client;

  scopes: string[] = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/firebase',
    'https://www.googleapis.com/auth/user.emails.read',
    'profile',
  ];

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.appData = appData;
    this.connectionData = connectionData;

    this.client = new GoogleApi.auth.OAuth2(
      connectionData.consumerKey as string,
      connectionData.consumerSecret as string,
      this.oauthRedirectUrl
    );

    GoogleApi.options({ auth: this.client });
  }

  get oauthRedirectUrl() {
    return this.appData.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    ).value;
  }

  async createAuthData() {
    const url = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });

    return { url };
  }

  async verifyCredentials() {
    const { tokens } = await this.client.getToken(
      this.connectionData.oauthVerifier as string
    );
    this.client.setCredentials(tokens);

    const people = GoogleApi.people('v1');

    const { data } = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses',
    });

    const { emailAddresses, resourceName: userId } = data;
    const primaryEmailAddress = emailAddresses.find(
      (emailAddress) => emailAddress.metadata.primary
    );

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenType: tokens.token_type,
      expiryDate: tokens.expiry_date,
      scope: tokens.scope,
      screenName: primaryEmailAddress.value,
      userId,
    };
  }

  async isStillVerified() {
    try {
      await this.client.getTokenInfo(this.connectionData.accessToken as string);
      return true;
    } catch {
      return false;
    }
  }
}
