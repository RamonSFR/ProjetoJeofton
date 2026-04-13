import {
  createRestaurantSchema,
  getRestaurantsQuerySchema,
  updateRestaurantSchema,
} from './restaurant-validation';

describe('createRestaurantSchema', () => {
  it('accepts valid payload', () => {
    const parsed = createRestaurantSchema.safeParse({ name: 'Pizzaria', managerId: 1 });
    expect(parsed.success).toBe(true);
  });
  it('rejects short name', () => {
    const parsed = createRestaurantSchema.safeParse({ name: 'A', managerId: 1 });
    expect(parsed.success).toBe(false);
  });
});

describe('updateRestaurantSchema', () => {
  it('rejects empty object', () => {
    const parsed = updateRestaurantSchema.safeParse({});
    expect(parsed.success).toBe(false);
  });
});

describe('getRestaurantsQuerySchema', () => {
  it('defaults pagination', () => {
    const parsed = getRestaurantsQuerySchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.page).toBe(1);
      expect(parsed.data.pageSize).toBe(20);
    }
  });
});
