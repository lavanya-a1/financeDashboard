jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { registerUser, loginUser } = require('../services/authService');
const { updateRecord, deleteRecord } = require('../services/recordService');

describe('Auth and Records Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registerUser stores new users as viewer and active', async () => {
    bcrypt.hash.mockResolvedValue('hashed-password');
    pool.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        role: 'viewer',
        is_active: true,
      }],
    });

    const user = await registerUser({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
      role: 'admin',
    });

    expect(user.role).toBe('viewer');
    expect(user.is_active).toBe(true);
    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      ['Alice', 'alice@example.com', 'hashed-password', 'viewer', true]
    );
  });

  test('loginUser rejects inactive users before password compare', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{
        id: 3,
        email: 'inactive@example.com',
        password: 'hashed-password',
        role: 'viewer',
        is_active: false,
      }],
    });

    await expect(
      loginUser({ email: 'inactive@example.com', password: 'password123' })
    ).rejects.toThrow('User is inactive');

    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test('updateRecord throws when record is missing or deleted', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    await expect(
      updateRecord(999, { note: 'updated note' })
    ).rejects.toThrow('Record not found');
  });

  test('deleteRecord throws when record is missing or already deleted', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    await expect(deleteRecord(999)).rejects.toThrow('Record not found');
  });
});
