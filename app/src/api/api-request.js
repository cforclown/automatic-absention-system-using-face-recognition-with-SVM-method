import { ApiRequestException } from '../exceptions/api-request-exceptions';
import Store from '../store';
import { SetSession } from '../reducer/actions';

// const authURL = `${Environment.getApiUrl()}/auth`;
const authURL = `${process.env.API_URL}/auth`;
// const apiURL = `${Environment.getApiUrl()}/api`;
const apiURL = `${process.env.API_URL}/api`;

let session = null;
export const setUserSession = (userSession) => session = userSession;

const handleResponse = async (res) => {
  const json = await res.json();
  if (!res.ok) {
    throw ApiRequestException.ThrowStatus(res.status, json.error);
  }

  return json.data;
};

const refactorParams = (params) => Object.assign(
  {}, 
  params ?? {
    method: 'GET',
  },
  { 
    headers: {
      Authorization: session ? `Bearer ${session.accessToken}` : null,
      'content-type': 'application/json',
    }
  }
);

export async function apiRequest(query, params, throw401 = false) {
  try{
    params = refactorParams(params);
    const res = await fetch(apiURL + query, params);
    if (!res.ok && res.status === 401 && !throw401 && session) {
      session = await refreshSession();
      return apiRequest(query, params, true);
    }
  
    return handleResponse(res);
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

export async function authRequest(query, params) {
  params = refactorParams(params);
  const res = await fetch(authURL + query, params);

  return handleResponse(res);
}

export async function login(username, password) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Cache', 'no-cache');
  const res = await fetch(`${authURL}/login`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  return handleResponse(res);
}
export function getPermissions() {
  return apiRequest('/users/permissions', null);
}

export async function logout() {
  await authRequest('/logout', null);
}

export async function refreshSession() {
  const newSession = await authRequest('/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });

  Store.dispatch(SetSession(newSession));

  return newSession;
}
