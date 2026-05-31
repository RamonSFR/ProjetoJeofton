import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const userServiceTarget =
    env.VITE_USER_SERVICE_TARGET ?? 'http://localhost:3001'
  const restaurantServiceTarget =
    env.VITE_RESTAURANT_SERVICE_TARGET ?? 'http://localhost:3002'
  const orderServiceTarget =
    env.VITE_ORDER_SERVICE_TARGET ?? 'http://localhost:3003'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/users': {
          target: userServiceTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/users/, '') || '/'
        },
        '/api/restaurants': {
          target: restaurantServiceTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/restaurants/, '') || '/'
        },
        '/api/orders': {
          target: orderServiceTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/orders/, '/orders')
        }
      }
    }
  }
})
