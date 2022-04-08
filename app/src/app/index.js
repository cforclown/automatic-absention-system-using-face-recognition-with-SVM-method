import React,  { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Switch , Route , withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "universal-cookie";
import { Loader } from "../components/loader";
import { SetSession } from "../reducer/actions";
import "./index.scss";
import 'react-toastify/dist/ReactToastify.css';


const Login = React.lazy(() => import("../pages/auth/login"));
const Home = React.lazy(() => import("../pages/home"));
const Page4xx = React.lazy(() => import("../pages/4xx"));
const Page5xx = React.lazy(() => import("../pages/4xx"));

const cookies = new Cookies();

function App(props) {
  //#region COMPONENT STATEs
  const isMounted=useRef(false);
  
  const dispatch = useDispatch();
  const session = useSelector(state => state.session);

  const [state, _setState] = useState({
    isLoading: false,
    isError: false,
  });
  function setState(newState){
    if(!isMounted.current) return;
    _setState(newState);
  }
  //#endregion

  //#region DIDMOUNT
  useEffect(async () => {
    isMounted.current=true;

    if (!session) {
      const sessionCookie = cookies.get(process.env.SESSION_TAG);
      if (sessionCookie) {
        try {
          dispatch(SetSession(sessionCookie))
          setState({ ...state, isLoading: false, isError:false });
        }
        catch (error) {
          toast.error(error.message);
          setState({ ...state, isLoading: false });
          const redirectPath = props.location ? props.location.pathname : "/";
          props.history.push({
            pathname: "/login",
            state: { redirectPath: redirectPath },
          });
        }
      }
      else {
        setState({ ...state, isLoading: false });
        const redirectPath = props.location ? props.location.pathname : "/";
        props.history.push({
          pathname: "/login",
          state: { redirectPath: redirectPath },
        });
      }
    }
    else{
      setState({ ...state, isLoading: false });
    }

    // UNMOUNT
    return ()=>{ isMounted.current=false; }
  }, []);
  //#endregion

  if (state.isLoading){
    return Loader;
  }

  return (
    <>
      <React.Suspense fallback={Loader}>
        <Switch>
          <Route exact path="/login" name="Login" render={(props) => <Login {...props} />} />
          <Route exact path="/404" name="404" render={(props) => <Page4xx {...props} />} />
          <Route exact path="/500" name="500" render={(props) => <Page5xx {...props} />} />
          <Route path="/" name="Dashboard" render={(props) => <Home {...props} />} />
        </Switch>
      </React.Suspense>
      <ToastContainer autoClose={3000} hideProgressBar />
    </>
  );
}

App.propTypes = {
  location: PropTypes.any,
  history: PropTypes.any,
};

export default withRouter(App);
