import { apiRequest } from "../api/api-request";

const baseUrl = "/users";

export async function getUser(userId) {
  return apiRequest(baseUrl + `/${userId}`);
}

export async function findUsers(query, pagination) {
  console.log(query, pagination);
  return apiRequest(baseUrl + '/find', {
    method: 'POST',
    body: JSON.stringify({ query, pagination })
  });
}

export async function createUser(userData) {
  return apiRequest(baseUrl, {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

export async function updateUser(userData) {
  return apiRequest(baseUrl, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
}

export async function changeUserAvatar(avatar) {
  return apiRequest(`${baseUrl}/profile/avatar`, {
    method: 'PUT',
    body: JSON.stringify(avatar),
  });
}

export async function getProfile() {
  return apiRequest(`${baseUrl}/profile/details`);
}
