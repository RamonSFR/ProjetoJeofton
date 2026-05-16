const USER_SERVICE_URL = process.env.USER_SERVICE_URL ?? 'http://127.0.0.1:3001';

export class CustomerNotFoundError extends Error {
  readonly name = 'CustomerNotFoundError';
  constructor(message = 'Cliente nao encontrado') {
    super(message);
  }
}

export type CustomerSnapshot = {
  readonly id: number;
  readonly name: string;
  readonly email: string;
};

export const assertCustomerExists = async (customerId: number): Promise<void> => {
  const url = `${USER_SERVICE_URL.replace(/\/$/, '')}/${customerId}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (response.status === 404) {
      throw new CustomerNotFoundError();
    }
    if (!response.ok) {
      throw new CustomerNotFoundError('Falha ao consultar servico de usuarios');
    }
  } catch (err) {
    if (err instanceof CustomerNotFoundError) {
      throw err;
    }
    throw new CustomerNotFoundError('Nao foi possivel contatar o servico de usuarios');
  }
};

type CustomerApiResponse = {
  id: unknown;
  name: unknown;
  email: unknown;
};

const parseCustomerSnapshot = (payload: CustomerApiResponse): CustomerSnapshot => {
  const { id, name, email } = payload;
  if (
    typeof id !== 'number' ||
    !Number.isInteger(id) ||
    typeof name !== 'string' ||
    typeof email !== 'string'
  ) {
    throw new CustomerNotFoundError('Resposta invalida do servico de usuarios');
  }
  return {
    id,
    name,
    email,
  };
};

export const fetchCustomerSnapshot = async (customerId: number): Promise<CustomerSnapshot> => {
  const url = `${USER_SERVICE_URL.replace(/\/$/, '')}/${customerId}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (response.status === 404) {
      throw new CustomerNotFoundError();
    }
    if (!response.ok) {
      throw new CustomerNotFoundError('Falha ao consultar servico de usuarios');
    }
    const body = (await response.json()) as CustomerApiResponse;
    return parseCustomerSnapshot(body);
  } catch (err) {
    if (err instanceof CustomerNotFoundError) {
      throw err;
    }
    throw new CustomerNotFoundError('Nao foi possivel contatar o servico de usuarios');
  }
};
