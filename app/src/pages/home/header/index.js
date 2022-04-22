import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";
import UserAvatar from "../../../components/user-avatar";
import { logout } from "../../../api/api-request";
import "./index.scss";
import { DeleteSession } from "../../../reducer/actions";


function Header({ history, onToggleSidebar }) {
  const user = useSelector((state) => state.session ? state.session.user : null);
  const dispatch = useDispatch();

  function onToggleSidebarClick() {
    if (!onToggleSidebar) return;
    onToggleSidebar();
  }
  function accDropdownToggler({ children, onClick }, ref) {
    return (
      <div
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        style={{ cursor: "pointer" }}
      >
        {children}
      </div>
    );
  }
  function onProfileClick() {
    if (!history) return;
    history.push("/profile");
  }
  function onSettingsClick() {
    if (!history) return;
    history.push("/settings");
  }
  async function onLogoutClick() {
    try {
      await logout();
    } catch (err) {
      console.err(err.message);
    }
    dispatch(DeleteSession());
    history.push('/login');
  }

  return (
    <div id="cl-home-header">
      <div className="cl-home-header-left">
        <div className="cl-home-header-sidebar-toggle-btn" onClick={onToggleSidebarClick}>
          <FontAwesomeIcon icon={["fa", "align-justify"]} />
        </div>
      </div>
      <div className="cl-home-header-right">
        <Dropdown>
          {
            user && <Dropdown.Toggle as={React.forwardRef(accDropdownToggler)} id="acc-dropdown">
              <UserAvatar userId={user._id} />
            </Dropdown.Toggle>
          }


          <Dropdown.Menu>
            <Dropdown.Header>
              <div className="text-center">Account</div>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item>
              <AccountDropdownMenuItem icon={["fa", "user-circle"]} title="Profile" onClickCallback={onProfileClick} />
            </Dropdown.Item>
            <Dropdown.Item>
              <AccountDropdownMenuItem icon={["fa", "cog"]} title="Settings" onClickCallback={onSettingsClick} />
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <AccountDropdownMenuItem icon={["fa", "sign-out-alt"]} title="Logout" onClickCallback={onLogoutClick} />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

Header.propTypes = {
  history: PropTypes.any,
  onToggleSidebar: PropTypes.func.isRequired,
};

function AccountDropdownMenuItem({ icon, title, onClickCallback }) {
  function onClick() {
    if (!onClickCallback) return;
    onClickCallback();
  }
  return (
    <div className="d-flex flex-row justify-content-start align-items-center text-secondary" onClick={onClick}>
      <div className="me-3">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h6 style={{ marginBottom: "2px" }}>{title}</h6>
    </div>
  );
}
AccountDropdownMenuItem.propTypes = {
  icon: PropTypes.array,
  title: PropTypes.string.isRequired,
  onClickCallback: PropTypes.func,
};

export default withRouter(Header);
