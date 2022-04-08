import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import defaultAvatar from "../../assets/images/default-avatar.png";


const Container = styled.div`
    display: block;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    border-radius: 50%;
    padding: 0;
    img {
        width: ${(props) => props.size}px;
        height: ${(props) => props.size}px;
        border-radius: 50%;
        border: none;
        object-fit: cover;
    }
    svg {
        position: absolute;
        left: 0;
        top: 0;
    }
    h6 {
        margin: 0;
        font-size: ${(props) => props.size / 2}px;
    }
`;

function Avatar({ userId, size, img }) {
  return (
    <Container size={size}>
      <img
        src={img ? img : userId ? `${process.env.API_URL}/api/users/avatar/${userId}` : defaultAvatar}
        alt={defaultAvatar}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultAvatar;
        }}
      />
    </Container>
  );
}

Avatar.propTypes = {
  img: PropTypes.any,
  userId: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
Avatar.defaultProps = {
  size: 36,
};

export default Avatar;
