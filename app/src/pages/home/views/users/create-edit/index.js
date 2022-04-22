import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader } from '../../../../../components/card';

function Users({ history }) {
  return (
    <Card>
      <CardHeader>
        <h6>Users</h6>
      </CardHeader>
      <CardBody>
        USERS
      </CardBody>
    </Card>
  );
}

Users.propTypes = {
  history: PropTypes.any
};

export default Users;
