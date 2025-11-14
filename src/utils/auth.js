import jnpf from '@/utils/jnpf'

export function getToken() {
  return jnpf.storageGet('token')
}

export function setToken(token) {
  return jnpf.storageSet({ token })
}

export function removeToken() {
  return jnpf.storageRemove('token')
}

export function getAccessToken() {
  return jnpf.storageGet('AccessToken')
}

export function setAccessToken(AccessToken) {
  return jnpf.storageSet({ AccessToken })
}

export function getLock() {
  return jnpf.storageGet('lock')
}

export function setLock(lock) {
  return jnpf.storageSet({ lock })
}
export function removeLock() {
  return jnpf.storageRemove('lock')
}
