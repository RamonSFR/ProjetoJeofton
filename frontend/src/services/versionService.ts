export type VersionInfo = {
  version: string
  environment: string
  buildDate: string
}

export async function fetchVersion(): Promise<VersionInfo> {
  const res = await fetch('/api/v1/version')
  if (!res.ok) {
    throw new Error('Falha ao carregar versão')
  }
  return res.json()
}
