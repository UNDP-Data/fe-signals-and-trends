import { AuthenticatedTemplate } from '@azure/msal-react';
import { Dropdown, Input, MenuProps, Modal, Select, Switch } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { updateUser } from '../API';
import { navLinks } from '../Constants';
import Context from '../Context/Context';

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
  useEffect(() => {
    setNameOfUser(name);
    setSelectedUnit(unit);
    setAcceleratorLab(isAcceleratorLab);
  }, [name, unit, isAcceleratorLab]);
  const [openModal, setOpenModal] = useState(false);

  const navigationItems: MenuProps['items'] = [
    {
      key: 'signals',
      label: (
        <NavLink
          to='./signals'
          style={{
            fontFamily: 'var(--fontFamily)',
            fontSize: '1.25rem',
            textTransform: 'none',
            padding: '0.75rem',
          }}
        >
          All Signals
        </NavLink>
      ),
    },
    {
      key: 'trends',
      label: (
        <NavLink
          to='./trends'
          style={{
            fontFamily: 'var(--fontFamily)',
            fontSize: '1.25rem',
            textTransform: 'none',
            padding: '0.75rem',
          }}
        >
          All Trends
        </NavLink>
      ),
    },
    ...(role === 'Admin' || role === 'Curator'
      ? [
          {
            key: 'archived-signals',
            label: (
              <NavLink
                to='./archived-signals'
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  padding: '0.75rem',
                }}
              >
                Archived Signals
              </NavLink>
            ),
          },
          {
            key: 'archived-trends',
            label: (
              <NavLink
                to='./archived-trends'
                style={{
                  fontFamily: 'var(--fontFamily)',
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  padding: '0.75rem',
                }}
              >
                Archived Trends
              </NavLink>
            ),
          },
        ]
      : []),
      {
        key: 'signal-analytics',
        label: (
          <NavLink
            to={navLinks.signalAnalytics}
            style={{
              fontFamily: 'var(--fontFamily)',
              fontSize: '1.25rem',
              textTransform: 'none',
              padding: '0.75rem',
            }}
          >
            Signal Analytics
          </NavLink>
        ),
      },
    {
      type: 'divider',
    },
    {
      key: 'favourites',
      label: (
        <NavLink
          to={navLinks.myFavorites}
          style={{
            fontFamily: 'var(--fontFamily)',
            fontSize: '1.25rem',
            textTransform: 'none',
            padding: '0.75rem',
          }}
        >
          My Favourites
        </NavLink>
      ),
    },
    {
      key: 'drafts',
      label: (
        <NavLink
          to={navLinks.myDrafts}
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
    // {
    //   key: 'sprints',
    //   label: (
    //     <NavLink
    //       to='/my-sprints'
    //       style={{
    //         fontFamily: 'var(--fontFamily)',      
    //         fontSize: '1.25rem',
    //         textTransform: 'none',
    //         padding: '0.75rem',
    //       }}
    //     >
    //       My Sprints
    //     </NavLink>
    //   ),
    // },  
    {
      key: 'profile',
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
            width: '100%',
            textAlign: 'left',
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
    ...(role === 'Admin'
      ? [
          {
            key: 'admin',
            label: (
              <NavLink
                to={navLinks.adminPanel}
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
        ]
      : []),
    {
      key: 'signout',
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
            width: '100%',
            textAlign: 'left',
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
            <NavLink
              to='./signals'
              className='header-link'
            >
              All Signals
            </NavLink>
          </div>
          <div>
            <NavLink
              to='./trends'
              className='header-link'
            >
              All Trends
            </NavLink>
          </div>
          {role === 'Admin' || role === 'Curator' ? (
            <>
              <div>
                <NavLink
                  to='./archived-signals'
                  className='header-link'
                >
                  Archived Signals
                </NavLink>
              </div>
              <div>
                <NavLink
                  to='./archived-trends'
                  className='header-link'
                >
                  Archived Trends
                </NavLink>
              </div>
            </>
          ) : null}
          <div>
            <NavLink to='/my-drafts' className='header-link'>My Drafts</NavLink>
          </div>
          {role === 'Admin' ? (
            <div>
              <NavLink to='/admin-panel' className='header-link'>Admin Panel</NavLink>
            </div>
          ) : null}
          <div>
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
            menu={{ items: navigationItems }}
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
                <Select.Option className='undp-select-option' key={d} value={d}>
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
