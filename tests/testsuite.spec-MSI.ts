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

  // 2. Get Room by ID
  test('Test case 02 - Get room by ID', async () => {
    const roomId = 1;
    const response = await request.get(`/api/room/${roomId}`, {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();

    const room = await response.json();
    expect(room.id).toBe(roomId);
  });

  // 3. Create a New Client
  test('Test case 03 - Create a new client', async () => {
    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };
    const response = await request.post('/api/client/new', {
      data: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-user-auth': JSON.stringify({ username: 'tester01', token }),
      },
    });
    expect(response.ok()).toBeTruthy();
    const client = await response.json();
    expect(client.name).toBe(payload.name);
    expect(client.email).toBe(payload.email);
  });

  // 4. Get All Clients
  test('Test case 04 - Get all clients', async () => {
    const response = await request.get('/api/clients', {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const clients = await response.json();
    expect(clients.length).toBeGreaterThan(0);
  });

  // 5. Get Client by ID
  test('Test case 05 - Get client by ID', async () => {
    const clientId = 2;
    const response = await request.get(`/api/client/${clientId}`, {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    const client = await response.json();
    expect(client.id).toBe(clientId);
  });

  // 6. Update Client
  test('Test case 06 - Update a client', async () => {
    const clientId = 1;
    const payload = {
      id: '1',
      name: 'Stina Johnson',
      email: 'stina.johnson@example.com',
    };
    const response = await request.put(`/api/client/${clientId}`, {
      data: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-user-auth': JSON.stringify({ username: 'tester01', token }),
      },
    });
    expect(response.ok()).toBeTruthy();
    const updatedClient = await response.json();
    expect(updatedClient.name).toBe(payload.name);
  });

})
