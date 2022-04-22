import ActionTypes from "./action-types";
import { setUserSession } from "../api/api-request";
import { deleteSession, storeSession } from "../utils/session-manager";

const initialState = {
  session: null,
  sidebar: {
    hidden: false,
    collapsed: false,
  },
};

const Reducer = (state = initialState, action) => {
  if (action.type === ActionTypes.SET_SESSION) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.session = action.param.session;
    setUserSession(action.param.session);
    storeSession(action.param.session);
    return newState;
  }
  if (action.type === ActionTypes.DELETE_SESSION) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.session = null;

    deleteSession();

    return newState;
  }

  if (action.type === ActionTypes.UPDATE_USER) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.session.user = action.param.user;
    return newState;
  }

  if (action.type === ActionTypes.SHOW_SIDEBAR) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.sidebar.hidden = false;
    newState.sidebar.collapsed = action.param.uncollapsed ? false : newState.sidebar.collapsed;
    return newState;
  }
  if (action.type === ActionTypes.HIDE_SIDEBAR) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.sidebar.hidden = true;
    newState.sidebar.collapsed = false;
    return newState;
  }
  if (action.type === ActionTypes.COLLAPSE_SIDEBAR) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.sidebar.collapsed = true;
    return newState;
  }
  if (action.type === ActionTypes.UNCOLLAPSE_SIDEBAR) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.sidebar.collapsed = false;
    return newState;
  }

  return state;
};

export default Reducer;
