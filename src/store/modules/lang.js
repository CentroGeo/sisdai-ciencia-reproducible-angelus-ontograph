import VueCookies from 'vue-cookies/vue-cookies'
import * as types from '../mutation-types'

// state
export const state = {
  locale: VueCookies.get('locale') || 'es',
  locales: {
    en: 'EN',
    es: 'ES',
  }
}

// getters
export const getters = {
  locale: state => state.locale,
  locales: state => state.locales
}

// mutations
export const mutations = {
  [types.SET_LOCALE] (state, { locale }) {
    state.locale = locale
  }
}

// actions
export const actions = {
  setLocale ({ commit }, { locale }) {
    commit(types.SET_LOCALE, { locale })

    VueCookies.set('locale', locale, 3600 * 24 * 30 * 12)
  }
}
