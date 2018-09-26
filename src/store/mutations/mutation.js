export default {
  GET_MAP_DATA(state, data) {
    state.mapData = data
  },
  SET_USER_DATA(state, data) {
    state.loginData = data
  },
  SET_MAP_TYPE(state, type) {
    state.mapType = type
  }
}
