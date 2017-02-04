import authService from '../authService';

export function getUser(context, token) {
  return authService.getUser(token).then(user => {
    context.commit('setUser', user);
  });
}

export function logout(context) {
  context.commit('clearUser');
}
