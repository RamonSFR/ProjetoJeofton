const USER_SERVICE_URL = process.env.USER_SERVICE_URL ?? 'http://127.0.0.1:3001';

/**
 * Erro quando o gerente nao existe no user-service ou a chamada HTTP falha.
 */
export class ManagerNotFoundError extends Error {
  readonly name = 'ManagerNotFoundError';
  constructor(message = 'Gerente nao encontrado no servico de usuarios') {
    super(message);
  }
}

/**
 * Garante que existe um usuario com o id informado no user-service (GET /:id — rota relativa ao servico).
 */
export const assertManagerExists = async (managerId: number): Promise<void> => {
  const url = `${USER_SERVICE_URL.replace(/\/$/, '')}/${managerId}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (response.status === 404) {
      throw new ManagerNotFoundError();
    }
    if (!response.ok) {
      throw new ManagerNotFoundError('Falha ao consultar servico de usuarios');
    }
  } catch (err) {
    if (err instanceof ManagerNotFoundError) {
      throw err;
    }
    throw new ManagerNotFoundError('Nao foi possivel contatar o servico de usuarios');
  }
};
