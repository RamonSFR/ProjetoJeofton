import { useEffect, useState } from 'react'

import { fetchVersion, type VersionInfo } from '../../services/versionService'
import * as S from './styles'

function envClass(environment: string): string {
  if (environment === 'Production') return 'production'
  if (environment === 'Staging') return 'staging'
  return 'development'
}

const Footer = () => {
  const [info, setInfo] = useState<VersionInfo | null>(null)

  useEffect(() => {
    fetchVersion()
      .then(setInfo)
      .catch(() => setInfo(null))
  }, [])

  if (!info) return null

  return (
    <S.FooterBar className="app-footer">
      <span>v{info.version}</span>
      <S.EnvBadge className={`env-badge env-${envClass(info.environment)}`}>
        {info.environment}
      </S.EnvBadge>
    </S.FooterBar>
  )
}

export default Footer
