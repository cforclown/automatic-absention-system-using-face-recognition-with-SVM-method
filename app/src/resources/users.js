import { apiRequest } from "../api/api-request";

const baseUrl = "/users";

export async function changeUserAvatar(avatar) {
  return apiRequest(`${baseUrl}/profile/avatar`, {
      method: 'PUT',
      body: JSON.stringify(avatar),
  });
}

export async function getProfile() {
  return apiRequest(`${baseUrl}/profile/details`);
}
