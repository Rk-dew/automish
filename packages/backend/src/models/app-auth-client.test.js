import { describe, it, expect, vi } from 'vitest';
import AES from 'crypto-js/aes.js';
import enc from 'crypto-js/enc-utf8.js';

import AppConfig from './app-config.js';
import AppAuthClient from './app-auth-client.js';
import Base from './base.js';
import appConfig from '../config/app.js';
import { createAppAuthClient } from '../../test/factories/app-auth-client.js';

describe('AppAuthClient model', () => {
  it('tableName should return correct name', () => {
    expect(AppAuthClient.tableName).toBe('app_auth_clients');
  });

  it('jsonSchema should have correct validations', () => {
    expect(AppAuthClient.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = AppAuthClient.relationMappings();

    const expectedRelations = {
      appConfig: {
        relation: Base.BelongsToOneRelation,
        modelClass: AppConfig,
        join: {
          from: 'app_auth_clients.app_key',
          to: 'app_configs.key',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  describe('encryptData', () => {
    it('should return undefined if eligibleForEncryption is not true', async () => {
      vi.spyOn(
        AppAuthClient.prototype,
        'eligibleForEncryption'
      ).mockReturnValue(false);

      const appAuthClient = new AppAuthClient();

      expect(appAuthClient.encryptData()).toBeUndefined();
    });

    it('should encrypt formattedAuthDefaults and set it to authDefaults', async () => {
      vi.spyOn(
        AppAuthClient.prototype,
        'eligibleForEncryption'
      ).mockReturnValue(true);

      const formattedAuthDefaults = {
        key: 'value',
      };

      const appAuthClient = new AppAuthClient();
      appAuthClient.formattedAuthDefaults = formattedAuthDefaults;
      appAuthClient.encryptData();

      const expectedDecryptedValue = JSON.parse(
        AES.decrypt(
          appAuthClient.authDefaults,
          appConfig.encryptionKey
        ).toString(enc)
      );

      expect(formattedAuthDefaults).toStrictEqual(expectedDecryptedValue);
      expect(appAuthClient.authDefaults).not.toStrictEqual(
        formattedAuthDefaults
      );
    });

    it('should encrypt formattedAuthDefaults and remove formattedAuthDefaults', async () => {
      vi.spyOn(
        AppAuthClient.prototype,
        'eligibleForEncryption'
      ).mockReturnValue(true);

      const formattedAuthDefaults = {
        key: 'value',
      };

      const appAuthClient = new AppAuthClient();
      appAuthClient.formattedAuthDefaults = formattedAuthDefaults;
      appAuthClient.encryptData();

      expect(appAuthClient.formattedAuthDefaults).not.toBeDefined();
    });
  });

  describe('decryptData', () => {
    it('should return undefined if eligibleForDecryption is not true', () => {
      vi.spyOn(
        AppAuthClient.prototype,
        'eligibleForDecryption'
      ).mockReturnValue(false);

      const appAuthClient = new AppAuthClient();

      expect(appAuthClient.decryptData()).toBeUndefined();
    });

    it('should decrypt authDefaults and set it to formattedAuthDefaults', async () => {
      vi.spyOn(
        AppAuthClient.prototype,
        'eligibleForDecryption'
      ).mockReturnValue(true);

      const formattedAuthDefaults = {
        key: 'value',
      };

      const authDefaults = AES.encrypt(
        JSON.stringify(formattedAuthDefaults),
        appConfig.encryptionKey
      ).toString();

      const appAuthClient = new AppAuthClient();
      appAuthClient.authDefaults = authDefaults;
      appAuthClient.decryptData();

      expect(appAuthClient.formattedAuthDefaults).toStrictEqual(
        formattedAuthDefaults
      );
      expect(appAuthClient.authDefaults).not.toStrictEqual(
        formattedAuthDefaults
      );
    });
  });

  describe('eligibleForEncryption', () => {
    it('should return true when formattedAuthDefaults property exists', async () => {
      const appAuthClient = await createAppAuthClient();

      expect(appAuthClient.eligibleForEncryption()).toBe(true);
    });

    it("should return false when formattedAuthDefaults property doesn't exist", async () => {
      const appAuthClient = await createAppAuthClient();

      delete appAuthClient.formattedAuthDefaults;

      expect(appAuthClient.eligibleForEncryption()).toBe(false);
    });
  });

  describe('eligibleForDecryption', () => {
    it('should return true when authDefaults property exists', async () => {
      const appAuthClient = await createAppAuthClient();

      expect(appAuthClient.eligibleForDecryption()).toBe(true);
    });

    it("should return false when authDefaults property doesn't exist", async () => {
      const appAuthClient = await createAppAuthClient();

      delete appAuthClient.authDefaults;

      expect(appAuthClient.eligibleForDecryption()).toBe(false);
    });
  });

  it('$beforeInsert should call AppAuthClient.encryptData', async () => {
    const appAuthClientBeforeInsertSpy = vi.spyOn(
      AppAuthClient.prototype,
      'encryptData'
    );

    await createAppAuthClient();

    expect(appAuthClientBeforeInsertSpy).toHaveBeenCalledOnce();
  });

  it('$beforeUpdate should call AppAuthClient.encryptData', async () => {
    const appAuthClient = await createAppAuthClient();

    const appAuthClientBeforeUpdateSpy = vi.spyOn(
      AppAuthClient.prototype,
      'encryptData'
    );

    await appAuthClient.$query().patchAndFetch({ name: 'sample' });

    expect(appAuthClientBeforeUpdateSpy).toHaveBeenCalledOnce();
  });

  it('$afterFind should call AppAuthClient.decryptData', async () => {
    const appAuthClient = await createAppAuthClient();

    const appAuthClientAfterFindSpy = vi.spyOn(
      AppAuthClient.prototype,
      'decryptData'
    );

    await appAuthClient.$query();

    expect(appAuthClientAfterFindSpy).toHaveBeenCalledOnce();
  });
});
