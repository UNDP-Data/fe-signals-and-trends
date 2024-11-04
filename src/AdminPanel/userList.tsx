import { Modal, Radio } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserDataType } from '../Types';
import { updateUser } from '../api';

interface Props {
  userList: UserDataType[];
}

const ListRow = styled.div`
  width: calc(100% - 4rem);
  background-color: var(--gray-200);
  padding: var(--spacing-07);
  margin-bottom: var(--spacing-07);
  border-radius: 2px;
`;

export function UserListEl(props: Props) {
  const { userList } = props;
  const [selectedUser, setSelectedUser] = useState<undefined | UserDataType>(
    undefined,
  );
  const navigate = useNavigate();
  const [role, setRole] = useState<string | undefined>(undefined);
  return (
    <>
      {userList.map((d, i) => (
        <ListRow key={i}>
          <div
            className='flex-div flex-space-between'
            style={{ alignItems: 'flex-start' }}
          >
            <div style={{ flexGrow: 1 }}>
              <div className='flex-div flex-vert-align-center margin-bottom-04'>
                <h5 className='undp-typography margin-bottom-00'>{d.name}</h5>
                <div
                  className='undp-chip'
                  style={{
                    backgroundColor:
                      d.role === 'Admin'
                        ? 'var(--blue-100)'
                        : d.role === 'Curator'
                        ? 'var(--light-green)'
                        : 'var(--gray-300)',
                  }}
                >
                  {d.role}
                </div>
              </div>
              <p
                className='undp-typography margin-bottom-00'
                style={{ color: 'var(--gray-600)', fontStyle: 'italic' }}
              >
                {d.email}
              </p>
            </div>
            <button
              type='button'
              className='undp-button button-primary'
              onClick={() => {
                setRole(d.role);
                setSelectedUser(d);
              }}
            >
              Update Role
            </button>
          </div>
        </ListRow>
      ))}
      <Modal
        className='undp-modal'
        open={selectedUser !== undefined}
        onCancel={() => {
          setSelectedUser(undefined);
        }}
        onOk={() => {
          setSelectedUser(undefined);
        }}
      >
        <h5 className='undp-typography'>
          Update Role for {selectedUser?.name}
        </h5>
        <p className='label margin-top-09'>Select a role</p>
        <Radio.Group
          value={role}
          onChange={e => {
            setRole(e.target.value);
          }}
          className='undp-button-radio margin-bottom-07'
        >
          <Radio.Button value='User'>User</Radio.Button>
          <Radio.Button value='Curator'>Curator</Radio.Button>
          <Radio.Button value='Admin'>Admin</Radio.Button>
        </Radio.Group>
        <div className='flex-div flex-wrap flex-space-between margin-top-05'>
          <button
            type='button'
            className='undp-button button-primary button-arrow'
            onClick={() => {
              if (selectedUser)
                updateUser(selectedUser?.id, {
                  ...selectedUser,
                  role: role as 'Admin' | 'Curator' | 'User' | 'Visitor',
                }).then(() => {
                  setRole(undefined);
                  setSelectedUser(undefined);
                  navigate(0);
                });
            }}
          >
            Update Role
          </button>
          <button
            type='button'
            className='undp-button button-tertiary'
            onClick={() => {
              setRole(undefined);
              setSelectedUser(undefined);
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}
