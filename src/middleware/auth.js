
import updateToken from '@/plugins/keycloakUpdateToken'

export default async (to, from, next) => {
  updateToken()
  next()
}
