import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader } from '../../content/card';

function Students({ history }) {
  return (
    <Card>
      <CardHeader>
        <h6>Students</h6>
      </CardHeader>
      <CardBody>
        STUDENTS
      </CardBody>
    </Card>
  );
}

Students.propTypes = {
  history: PropTypes.any
};

export default Students;
