import React, { useState, useRef } from "react";
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Avatar from "../../../../components/user-avatar";
import { changeUserAvatar } from "../../../../resources/users";
import { Card, CardBody, CardHeader } from "../../content/card";
import { UpdateUser } from "../../../../reducer/actions";
import { ApiRequestException } from "../../../../exceptions/api-request-exceptions";
import { API_REQUEST_EXCEPTION_CODES } from "../../../../exceptions/exceptions-types";
import "./index.scss"

const fileFormats = ["jpg", "jpeg", "png"].map((x) => "." + x).join(",");

function Profile({ history }) {
  const user = useSelector((state) => state.session.user);
  const [avatarImg, setAvatarImg] = useState(null)
  const dispatch = useDispatch();
  const [isLoading, setIsLoading]=useState(false)
  const avatarInputRef=useRef();

  async function changeAvatar(avatarData){
    try{
      setIsLoading(true);
      const user = await changeUserAvatar(avatarData);
      setAvatarImg(user.avatar.data)
      dispatch(UpdateUser(user));
      setIsLoading(false);
    }
    catch(err){
      if(err instanceof ApiRequestException){
        if(err.code===API_REQUEST_EXCEPTION_CODES.unauthorized)
          return history.push('/login');
      }

      toast.error(err.message);
      setIsLoading(false)
    }
  }

  function onBrowseAvatarClick(){
    avatarInputRef.current.click();
  }
  function onAvatarFileSelected(e) {
    const files = e.target.files;
    if (files && files[0]){
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const bstr = e.target.result;

          const avatar = {
              data: bstr,
              filename: files[0].name,
          };
          
          changeAvatar(avatar);
        }
        catch (err) {
          console.log(err.message);
          toast.error(err.message);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h6>PROFILE</h6>
      </CardHeader>
      <CardBody>
        <div id="cl-profile">
          <div className="cl-profile-avatar">
            <Avatar img={avatarImg} userId={user._id} size="120" />
            <div className="cl-profile-avatar-change-btn">
              <button type="button" className="btn btn-secondary" disabled={isLoading} onClick={onBrowseAvatarClick}>
                <FontAwesomeIcon icon={['fas', 'camera']} />
              </button>
            </div>
          </div>
          <label>@{user.username}</label>
          <h4>{user.fullname}</h4>
          <p>{user.email ?? '-'}</p>
          <label style={{ marginTop: 0 }}>{user.role.name}</label>
        </div>
      </CardBody>
      <div className='d-flex flex-row'>
        <input
          type="file"
          className="form-control"
          style={{ visibility: "collapse" }}
          accept={fileFormats}
          onChange={onAvatarFileSelected}
          multiple={false}
          ref={avatarInputRef}
        />
      </div>
    </Card>
  )
}

Profile.propTypes = {
  history: PropTypes.any
}

export default Profile;
