const USER_SERVICE_URL = process.env.USER_SERVICE_URL ?? 'http://127.0.0.1:3001';

export class CustomerNotFoundError extends Error {
  readonly name = 'CustomerNotFoundError';
  constructor(message = 'Cliente nao encontrado') {
    super(message);
  }
}

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
