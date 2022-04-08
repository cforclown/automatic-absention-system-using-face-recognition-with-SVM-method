import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { Loader } from "../../../components/loader";
import routes from "../routes";

import "./index.scss";

function Content() {
    return (
        <div id="cl-home-content">
            <React.Suspense fallback={Loader}>
                <Switch>
                    <Redirect exact from="/" to="/dashboard" />
                    {routes.map((route, index) => {
                        return <Route key={index} exact={route.exact} path={route.path} name={route.name} render={(props) => <route.component {...props} />} />;
                    })}
                </Switch>
            </React.Suspense>
        </div>
    );
}

export default Content;
