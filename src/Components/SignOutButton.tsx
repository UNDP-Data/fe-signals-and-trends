import { AuthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Dropdown, Input, MenuProps, Modal, Select } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UNITS } from '../Constants';
import Context from '../Context/Context';

interface Props {
  signOutClickHandler: () => void;
}

export function SignOutButton(props: Props) {
  const { signOutClickHandler } = props;
  const { name, userName, role, unit, updateName, updateUnit } =
    useContext(Context);
  const [selectedUnit, setSelectedUnit] = useState(unit);
  const [nameOfUser, setNameOfUser] = useState(name);
  useEffect(() => {
    setNameOfUser(name);
    setSelectedUnit(unit);
  }, [name, unit]);
  const [openModal, setOpenModal] = useState(false);
  const items: MenuProps['items'] =
    role === 'Admin'
      ? [
          {
            key: '2',
            label: (
              <button
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  border: 0,
                  background: 'none',
                  margin: 0,
                  padding: '0.75rem',
                }}
                type='button'
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                View My Profile
              </button>
            ),
          },
          {
            key: '3',
            label: (
              <NavLink
                to='/admin-panel'
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  padding: '0.75rem',
                }}
              >
                Admin Panel
              </NavLink>
            ),
          },
          {
            key: '4',
            label: (
              <button
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  background: 'none',
                  border: 0,
                  margin: 0,
                  padding: '0.75rem',
                }}
                type='button'
                onClick={() => {
                  signOutClickHandler();
                }}
              >
                Sign Out
              </button>
            ),
          },
        ]
      : [
          {
            key: '2',
            label: (
              <button
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  background: 'none',
                  border: 0,
                  margin: 0,
                  padding: '0.75rem',
                }}
                type='button'
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                View My Profile
              </button>
            ),
          },
          {
            key: '2',
            label: (
              <button
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  background: 'none',
                  border: 0,
                  margin: 0,
                  padding: '0.75rem',
                }}
                type='button'
                onClick={() => {
                  signOutClickHandler();
                }}
              >
                Sign Out
              </button>
            ),
          },
        ];
  return (
    <AuthenticatedTemplate>
      <Dropdown
        menu={{ items }}
        placement='bottomRight'
        className='undp-button-dropdown'
        overlayClassName='undp-dropdown-menu'
      >
        <div>Hi {name?.split(' ')[0] || userName?.split('@')[0]}</div>
      </Dropdown>
      <Modal
        className='undp-modal'
        onCancel={() => {
          setOpenModal(false);
        }}
        onOk={() => {
          setOpenModal(false);
        }}
        open={openModal}
      >
        <h5 className='undp-typography'>My Profile</h5>
        <div className='flex-div flex-wrap flex-space-between margin-top-07 margin-bottom-05'>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '15rem',
              width: 'calc(50% - 2rem)',
            }}
          >
            <p className='undp-typography margin-bottom-02'>Name</p>
            <Input
              className='undp-input'
              value={nameOfUser}
              placeholder='Enter name'
              onChange={e => {
                setNameOfUser(e.target.value);
              }}
            />
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '15rem',
              width: 'calc(50% - 2rem)',
            }}
          >
            <p className='undp-typography margin-bottom-02'>E-mail ID</p>
            <Input className='undp-input' disabled value={userName} />
          </div>
        </div>
        <div className='flex-div flex-wrap flex-space-between margin-bottom-07'>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '15rem',
              width: 'calc(50% - 2rem)',
            }}
          >
            <p className='undp-typography margin-bottom-02'>Unit</p>
            <Select
              className='undp-select margin-bottom-07'
              placeholder='Select a unit'
              onChange={e => {
                setSelectedUnit(e);
              }}
              value={selectedUnit || unit}
              showSearch
            >
              {UNITS.map((d, i) => (
                <Select.Option className='undp-select-option' key={i} value={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '15rem',
              width: 'calc(50% - 2rem)',
            }}
          >
            <p className='undp-typography margin-bottom-02'>Role</p>
            <Input className='undp-input' disabled value={role} />
          </div>
        </div>
        <div className='flex-div flex-wrap flex-space-between'>
          <button
            type='button'
            className='undp-button button-primary button-arrow'
            onClick={() => {
              const { accounts, instance } = useMsal();
              const accessTokenRequest = {
                scopes: ['user.read'],
                account: accounts[0],
              };
              instance
                .acquireTokenSilent(accessTokenRequest)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((accessTokenResponse: any) => {
                  axios({
                    method: 'put',
                    url: 'https://signals-and-trends-api.azurewebsites.net/v1/users/update',
                    data: {
                      email: userName,
                      name: nameOfUser,
                      unit: selectedUnit,
                      role,
                    },
                    headers: {
                      'Content-Type': 'application/json',
                      access_token: accessTokenResponse.accessToken,
                    },
                  }).then(() => {
                    setOpenModal(false);
                    updateName(nameOfUser);
                    updateUnit(selectedUnit);
                  });
                });
            }}
          >
            Update Profile
          </button>
          <button
            type='button'
            className='undp-button button-tertiary'
            onClick={() => {
              setSelectedUnit(unit);
              setNameOfUser(name);
              setOpenModal(false);
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </AuthenticatedTemplate>
  );
}