/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CardBody, CardHeader } from '../../../../components/card';
import { CLCard } from '../../../../components/card/card-base';
import { findUsers } from '../../../../resources/users';
import BaseTable, { AutoResizer, Column } from 'react-base-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const QueryContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 1rem 0;
  
  .query-input {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    input {
      margin: 0 0.6rem 0 0 !important;
      width: 14rem;
    }
  }

  button {
    font-weight: bold;
  }
`;
const TableContainer = styled.div`
  height: calc(100vh - (56px + 36px) - 9rem);
`;

function Users({ history }) {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState({
    query: '',
    pagination: {
      page: 1,
      limit: 100,
      sort: {
        by: 'username',
        order: 1,
      }
    }
  });
  const [users, setUsers] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    setIsLoading(true);
    const usersData = await findUsers(query.query, query.pagination);
    setUsers(usersData.data);
    setIsLoading(false);
  }

  function onCreateClick() {
    history.push('/master-data/users/create-edit');
  }

  function onDeleteClick(userId) {
    history.push('/master-data/users/create-edit/' + userId);
  }

  const columns = [
    {
      key: "username",
      dataKey: "username",
      title: "Username",
      width: 200,
      resizable: true,
      align: Column.Alignment.CENTER,
    },
    {
      key: "fullname",
      dataKey: "fullname",
      title: "Fullname",
      width: 240,
      resizable: true,
      align: Column.Alignment.CENTER,
    },
    {
      key: "email",
      dataKey: "email",
      title: "Email",
      width: 240,
      resizable: true,
      align: Column.Alignment.CENTER,
    },
    {
      key: "role",
      dataKey: "role",
      title: "Role",
      width: 160,
      resizable: true,
      align: Column.Alignment.CENTER,
      cellRenderer: ({ rowData }) => <>{rowData.role.name}</>
    },
    {
      key: "action",
      dataKey: "action",
      title: "Action",
      width: 120,
      resizable: false,
      align: Column.Alignment.RIGHT,
      frozen: Column.FrozenDirection.RIGHT,
      cellRenderer: ({ rowData }) => (
        <>
          <button
            type="button"
            className="btn btn-warning"
            style={{ marginRight: "8px" }}
            onClick={() => history.push("/master-data/users/create-edit/" + rowData._id, { state: { user: { ...rowData } } })}
          >
            <FontAwesomeIcon size="sm" icon={["fas", "pencil-alt"]} />
          </button>
          <button type="button" className="btn btn-danger" onClick={() => onDeleteClick(rowData.id)} >
            <FontAwesomeIcon size="sm" icon={["fas", "trash"]} />
          </button>
        </>
      )
    },
  ];

  return (
    <CLCard>
      <CardHeader>
        <h6>Users</h6>
      </CardHeader>
      <CardBody>
        <QueryContainer>
          <div className=' query-input'>
            <input type="text" className='form-control' onChange={(e) => setQuery({ ...query, query: e.target.value })} />
            <button type="button" className="btn btn-primary" onClick={() => getUsers()}>
              <FontAwesomeIcon size="sm" icon={["fas", "search"]} />
            </button>
          </div>
          <button type="button" className="btn btn-success" onClick={onCreateClick}>
            <FontAwesomeIcon size="sm" icon={["fas", "plus"]} /> Add user
          </button>
        </QueryContainer>
        <TableContainer>
          {
            users && users.length ?
              <AutoResizer>
                {({ width, height }) => {
                  return (
                    <BaseTable
                      key={0}
                      fixed
                      width={width}
                      height={height}
                      columns={columns}
                      data={users}
                      disabled={isLoading}
                    />
                  );
                }}
              </AutoResizer> :
              <div className="alert alert-danger text-center" role="alert">
                No users found
              </div>
          }
        </TableContainer>
      </CardBody>
    </CLCard>
  );
}

Users.propTypes = {
  history: PropTypes.any
};

export default Users;
