import {
  createUserBodySchema,
  getUsersQuerySchema,
  updateUserBodySchema,
  userIdParamSchema,
} from './user-validation';

describe('createUserBodySchema', () => {
  it('accepts valid CPF with punctuation', () => {
    const parsed = createUserBodySchema.safeParse({
      cpf: '123.456.789-01',
      name: 'Jo Silva',
      email: 'jo@exemplo.com',
      password: 'senha1234',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.cpf).toBe('12345678901');
    }
  });
  it('rejects CPF with wrong digit count', () => {
    const parsed = createUserBodySchema.safeParse({
      cpf: '123',
      name: 'Jo',
      email: 'jo@exemplo.com',
      password: 'senha1234',
    });
    expect(parsed.success).toBe(false);
  });
  it('rejects short password', () => {
    const parsed = createUserBodySchema.safeParse({
      cpf: '12345678901',
      name: 'Jo Silva',
      email: 'jo@exemplo.com',
      password: 'curta',
    });
    expect(parsed.success).toBe(false);
  });
});

describe('updateUserBodySchema', () => {
  it('rejects empty object', () => {
    const parsed = updateUserBodySchema.safeParse({});
    expect(parsed.success).toBe(false);
  });
  it('accepts partial name', () => {
    const parsed = updateUserBodySchema.safeParse({ name: 'Novo nome' });
    expect(parsed.success).toBe(true);
  });
});

describe('getUsersQuerySchema', () => {
  it('defaults page and pageSize', () => {
    const parsed = getUsersQuerySchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.page).toBe(1);
      expect(parsed.data.pageSize).toBe(20);
    }
  });
});

describe('userIdParamSchema', () => {
  it('coerces id from string', () => {
    const parsed = userIdParamSchema.safeParse({ id: '7' });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.id).toBe(7);
    }
  });
});
