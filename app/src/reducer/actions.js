import ActionTypes from "./action-types";

export function SetSession(session) {
    return {
        type: ActionTypes.SET_SESSION,
        param: {
            session: session,
        },
    };
}
export function DeleteSession() {
    return {
        type: ActionTypes.DELETE_SESSION,
        param: null,
    };
}

export function UpdateUser(user) {
    return { 
      type: ActionTypes.UPDATE_USER,
      param: { user } 
    };
}

export function ShowSidebar(uncollapsed = false) {
    return {
        type: ActionTypes.SHOW_SIDEBAR,
        param: { uncollapsed },
    };
}
export function HideSidebar() {
    return {
        type: ActionTypes.HIDE_SIDEBAR,
        param: null,
    };
}
export function CollapseSidebar() {
    return {
        type: ActionTypes.COLLAPSE_SIDEBAR,
        param: null,
    };
}
export function UncollapseSidebar() {
    return {
        type: ActionTypes.UNCOLLAPSE_SIDEBAR,
        param: null,
    };
}
