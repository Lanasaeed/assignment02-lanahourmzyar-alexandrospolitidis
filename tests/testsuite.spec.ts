import { test, expect, APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';

test.describe('TheTester Hotel API Tests', () => {
  let request: APIRequestContext;
  let token: string;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: BASE_URL,
    });


    const loginResponse = await request.post('/api/login', {
      data: {
        username: 'tester01',
        password: 'GteteqbQQgSr88SwNExUQv2ydb7xuf8c',
      },
      headers: { 'Content-Type': 'application/json' },
    });
    const loginData = await loginResponse.json();
    token = loginData.token;
  });

  // 1. Get All Rooms
  test('Test case 01 - Get all rooms', async () => {
    const response = await request.get('/api/rooms', {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const rooms = await response.json();
    expect(rooms.length).toBeGreaterThan(0);
  });
})