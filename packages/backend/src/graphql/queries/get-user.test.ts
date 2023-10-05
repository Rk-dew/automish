import request, { Test } from 'supertest';
import app from '../../app';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id';
import Crypto from 'crypto';
import createRole from '../../../test/fixtures/role';
import createPermission from '../../../test/fixtures/permission';
import createUser from '../../../test/fixtures/user';
import { IRole, IUser } from '@automatisch/types';

describe('getUser', () => {
  describe('with unauthorized user', () => {
    it('should throw not authorized error', async () => {
      const invalidUserId = '123123123';

      const query = `
        query {
          getUser(id: "${invalidUserId}") {
            id
            email
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', 'invalid-token')
        .send({ query })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toEqual('Not Authorised!');
    });
  });

  describe('with authorized user', () => {
    let role: IRole,
      currentUser: IUser,
      anotherUser: IUser,
      token: string,
      requestObject: Test;

    beforeEach(async () => {
      role = await createRole({
        key: 'sample',
        name: 'sample',
      });

      await createPermission({
        action: 'read',
        subject: 'User',
        roleId: role.id,
      });

      currentUser = await createUser({
        roleId: role.id,
      });

      anotherUser = await createUser({
        roleId: role.id,
      });

      token = createAuthTokenByUserId(currentUser.id);
      requestObject = request(app)
        .post('/graphql')
        .set('Authorization', `${token}`);
    });

    it('should return user data for a valid user id', async () => {
      const query = `
        query {
          getUser(id: "${anotherUser.id}") {
            id
            email
            fullName
            email
            createdAt
            updatedAt
            role {
              id
              name
            }
          }
        }
      `;

      const response = await requestObject.send({ query }).expect(200);

      const expectedResponsePayload = {
        data: {
          getUser: {
            createdAt: (anotherUser.createdAt as Date).getTime().toString(),
            email: anotherUser.email,
            fullName: anotherUser.fullName,
            id: anotherUser.id,
            role: { id: role.id, name: role.name },
            updatedAt: (anotherUser.updatedAt as Date).getTime().toString(),
          },
        },
      };

      expect(response.body).toEqual(expectedResponsePayload);
    });

    it('should not return user password for a valid user id', async () => {
      const query = `
        query {
          getUser(id: "${anotherUser.id}") {
            id
            email
            password
          }
        }
      `;

      const response = await requestObject.send({ query }).expect(400);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toEqual(
        'Cannot query field "password" on type "User".'
      );
    });

    it('should return not found for invalid user id', async () => {
      const invalidUserId = Crypto.randomUUID();

      const query = `
        query {
          getUser(id: "${invalidUserId}") {
            id
            email
            fullName
            email
            createdAt
            updatedAt
            role {
              id
              name
            }
          }
        }
      `;

      const response = await requestObject.send({ query }).expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toEqual('NotFoundError');
    });
  });
});
