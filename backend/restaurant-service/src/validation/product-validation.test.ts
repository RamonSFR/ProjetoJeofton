import {
  createProductBodySchema,
  getProductsQuerySchema,
  updateProductBodySchema,
} from './product-validation';

describe('createProductBodySchema', () => {
  it('accepts valid product', () => {
    const parsed = createProductBodySchema.safeParse({ name: 'Pizza', price: 12.5 });
    expect(parsed.success).toBe(true);
  });
  it('rejects non-positive price', () => {
    const parsed = createProductBodySchema.safeParse({ name: 'Pizza', price: 0 });
    expect(parsed.success).toBe(false);
  });
});

describe('updateProductBodySchema', () => {
  it('rejects empty object', () => {
    const parsed = updateProductBodySchema.safeParse({});
    expect(parsed.success).toBe(false);
  });
});

describe('getProductsQuerySchema', () => {
  it('parses ids from comma string', () => {
    const parsed = getProductsQuerySchema.safeParse({ ids: '1,2,3' });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.ids).toEqual([1, 2, 3]);
    }
  });
});
