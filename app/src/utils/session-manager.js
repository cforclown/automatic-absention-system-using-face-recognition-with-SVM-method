import Cookies from "universal-cookie";

const cookies = new Cookies();
const sessionTag = process.env.SESSION_TAG;

export function storeSession(session) {
  if (!session.user || !session.accessToken || !session.refreshToken) {
    console.error("Invalid Session object");
  }

  const options = {
    path: '/',
    maxAge: session.expiresIn ? session.expiresIn : 3600,
    sameSite: "strict"
  };
  cookies.set(sessionTag + "_USER", JSON.stringify(session.user), options);
  cookies.set(sessionTag + "_ACCESS_TOKEN", JSON.stringify(session.accessToken), options);
  cookies.set(sessionTag + "_REFRESH_TOKEN", JSON.stringify(session.refreshToken), options);
}

export function deleteSession() {
  const options = {
    path: '/',
    sameSite: "strict"
  };
  cookies.remove(sessionTag + "_USER", options);
  cookies.remove(sessionTag + "_ACCESS_TOKEN", options);
  cookies.remove(sessionTag + "_REFRESH_TOKEN", options);
}

export function getSession() {
  const user = cookies.get(sessionTag + "_USER");
  const accessToken = cookies.get(sessionTag + "_ACCESS_TOKEN");
  const refreshToken = cookies.get(sessionTag + "_REFRESH_TOKEN");

  return user && accessToken && refreshToken ? { user, accessToken, refreshToken } : null;
}
