import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader } from '../../../../components/card';

function Roles({ history }) {
  return (
    <Card>
      <CardHeader>
        <h6>Roles</h6>
      </CardHeader>
      <CardBody>
        ROLES
      </CardBody>
    </Card>
  );
}

Roles.propTypes = {
  history: PropTypes.any
};

export default Roles;
