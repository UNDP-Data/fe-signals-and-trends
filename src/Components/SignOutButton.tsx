import { AuthenticatedTemplate } from '@azure/msal-react';
import { Dropdown, Input, MenuProps, Modal, Select, Switch } from 'antd';
import { useContext, useEffect, useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Context from '../Context/Context';
import { updateUser } from '../API';

interface Props {
  signOutClickHandler: () => void;
  mobileView?: boolean;
}

export function SignOutButton(props: Props) {
  const { signOutClickHandler, mobileView } = props;
  const {
    name,
    userName,
    role,
    unit,
    updateName,
    updateUnit,
    userID,
    updateNotificationText,
    updateIsAcceleratorLab,
    isAcceleratorLab,
    choices,
  } = useContext(Context);
  const [selectedUnit, setSelectedUnit] = useState(unit);
  const [acceleratorLab, setAcceleratorLab] = useState(isAcceleratorLab);
  const [nameOfUser, setNameOfUser] = useState(name);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [submittingError, setSubmittingError] = useState<undefined | string>(
    undefined,
  );
  // const navigate = useNavigate();
  useEffect(() => {
    setNameOfUser(name);
    setSelectedUnit(unit);
    setAcceleratorLab(isAcceleratorLab);
  }, [name, unit, isAcceleratorLab]);
  const [openModal, setOpenModal] = useState(false);
  const items: MenuProps['items'] =
    role === 'Admin'
      ? [
          {
            key: '1',
            label: (
              <NavLink
                to='/my-drafts'
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  padding: '0.75rem',
                }}
              >
                My Drafts
              </NavLink>
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
                  border: 0,
                  background: 'none',
                  margin: 0,
                  padding: '0.75rem',
                }}
                type='button'
                onClick={() => {
                  setNameOfUser(name);
                  setSelectedUnit(unit);
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
              <NavLink
                to='/my-favorites'
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  padding: '0.75rem',
                }}
              >
                My Favorites
              </NavLink>
            ),
          },
          {
            key: '5',
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
            key: '1',
            label: (
              <NavLink
                to='/my-drafts'
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  padding: '0.75rem',
                }}
              >
                My Drafts
              </NavLink>
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
                to='/my-favorites'
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  padding: '0.75rem',
                }}
              >
                My Favorites
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
        ];
  return (
    <>
      {mobileView === true ? (
        <AuthenticatedTemplate>
          <div>
            <NavLink to='/my-drafts'>My Drafts</NavLink>
          </div>
          {role === 'Admin' ? (
            <div>
              <NavLink to='/admin-panel'>Admin Panel</NavLink>
            </div>
          ) : null}
          <div>
            <div>
              <NavLink to='/my-favorites'>My Favorites</NavLink>
            </div>
            <button
              type='button'
              onClick={() => {
                setNameOfUser(name);
                setSelectedUnit(unit);
                setOpenModal(true);
              }}
              className='undp-button button-secondary'
            >
              View My Profile
            </button>
          </div>
          <div>
            <button
              type='button'
              onClick={() => {
                signOutClickHandler();
              }}
              className='undp-button button-secondary'
            >
              Sign Out
            </button>
          </div>
        </AuthenticatedTemplate>
      ) : (
        <AuthenticatedTemplate>
          <Dropdown
            menu={{ items }}
            placement='bottomRight'
            className='undp-button-dropdown'
            overlayClassName='undp-dropdown-menu'
          >
            <div>Hi {name?.split(' ')[0] || userName?.split('@')[0]}</div>
          </Dropdown>
        </AuthenticatedTemplate>
      )}
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
        {role === 'User' ? (
          <div
            className='margin-top-07'
            style={{
              padding: 'var(--spacing-05)',
              backgroundColor: 'var(--gray-200)',
              border: '1px solid var(--gray-400)',
            }}
          >
            <h6 className='undp-typography margin-bottom-00'>
              Want to be a signal scanner?{' '}
              <a
                href='https://forms.office.com/Pages/ResponsePage.aspx?id=Xtvls0QpN0iZ9XSIrOVDGYk-3BWZzm5BkSonyo1IdkBUN0RSVlFFSFlRS0RQWEpMU1hPNlFONDNRSy4u'
                className='undp-style'
              >
                Sign up here
              </a>
            </h6>
          </div>
        ) : null}
        <div className='flex-div flex-wrap flex-space-between margin-top-05 margin-bottom-05'>
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
        <div className='flex-div flex-wrap flex-space-between'>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '15rem',
              width: 'calc(50% - 2rem)',
            }}
          >
            <p className='undp-typography margin-bottom-02'>Unit</p>
            <Select
              className='undp-select margin-bottom-05'
              placeholder='Select a unit'
              onChange={e => {
                setSelectedUnit(e);
              }}
              value={selectedUnit || unit}
              showSearch
            >
              {choices?.unit_name.map((d, i) => (
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
        <div className='flex-div flex-wrap flex-space-between margin-bottom-09'>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '15rem',
              width: 'calc(50% - 2rem)',
            }}
          >
            <p className='undp-typography margin-bottom-02'>
              Are you part of Accelerator Labs
            </p>
            <Switch
              className='undp-switch'
              checked={acceleratorLab}
              onChange={d => setAcceleratorLab(d)}
            />
          </div>
        </div>
        <div className='flex-div flex-wrap flex-space-between'>
          <button
            type='button'
            className='undp-button button-primary button-arrow'
            onClick={() => {
              setButtonDisabled(true);
              setSubmittingError(undefined);
              if (userID)
                updateUser(userID, {
                  email: userName,
                  name: nameOfUser,
                  unit: selectedUnit,
                  role,
                  id: userID,
                  acclab: acceleratorLab,
                })
                  .then(() => {
                    setOpenModal(false);
                    setButtonDisabled(false);
                    updateName(nameOfUser);
                    updateUnit(selectedUnit);
                    updateIsAcceleratorLab(acceleratorLab);
                    updateNotificationText('Successfully updated the profile');
                  })
                  .catch(err => {
                    setButtonDisabled(false);
                    setSubmittingError(
                      `${err}. ${
                        err.response?.status === 500
                          ? 'Please try again in some time'
                          : ''
                      }`,
                    );
                  });
            }}
          >
            Update Profile
          </button>
          {submittingError ? (
            <p
              className='margin-top-00 margin-bottom-00'
              style={{ color: 'var(--dark-red)' }}
            >
              {submittingError}
            </p>
          ) : null}
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
        {buttonDisabled ? (
          <div className='margin-top-04 margin-bottom-04'>
            <div className='undp-loader' style={{ margin: '0 auto' }} />
          </div>
        ) : null}
      </Modal>
    </>
  );
}
