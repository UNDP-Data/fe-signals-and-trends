import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { NavLink } from 'react-router-dom';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { useContext, useState } from 'react';
import { SignOutButton } from './SignOutButton';
import { SignInButtonForHeader } from './SignInButtonForHeader';
import Context from '../Context/Context';

interface Props {
  signOutClickHandler: () => void;
}

export function Header(props: Props) {
  const { signOutClickHandler } = props;
  const { role } = useContext(Context);
  const [showMenu, setShowMenu] = useState(false);
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <NavLink
          to='/add-new-signal'
          style={{
            fontFamily: 'var(--fontFamily)',
            fontSize: '1.25rem',
            textTransform: 'none',
            padding: '0.75rem',
          }}
        >
          Signal
        </NavLink>
      ),
    },
    {
      key: '2',
      disabled: role === 'User',
      label: (
        <NavLink
          to='/add-new-trend'
          style={{
            fontFamily: 'var(--fontFamily)',
            fontSize: '1.25rem',
            textTransform: 'none',
            padding: '0.75rem',
          }}
        >
          Trend
        </NavLink>
      ),
    },
  ];

  return (
    <header className='undp-country-header'>
      <div className='undp-header-bg flex-space-between flex-div flex-vert-align-center'>
        <div className='flex-div flex-vert-align-center'>
          <img
            src='https://design.undp.org/static/media/undp-logo-blue.4f32e17f.svg'
            alt='UNDP Logo'
            width='60'
            height='122'
          />
          <div className='undp-site-title'>
            <span>
              <NavLink to='./' className='logo-sub-head'>
                Data Futures Platform
              </NavLink>
            </span>
            <NavLink
              to='./'
              style={{
                textDecoration: 'none',
                color: 'var(--black)',
                lineHeight: 1.25,
              }}
            >
              UNDP Future Trends and Signals System
            </NavLink>
          </div>
        </div>
        <div
          className='undp-nav-div flex-div'
          style={{ justifyContent: 'space-between', flexGrow: 1 }}
        >
          <div
            className='flex-div gap-09'
            style={{ flexGrow: 1, justifyContent: 'center' }}
          >
            <AuthenticatedTemplate>
              <NavLink
                to='./signals'
                className={({ isActive }) =>
                  isActive ? 'header-link-active' : 'header-link'
                }
              >
                All Signals
              </NavLink>
              <NavLink
                to='./trends'
                className={({ isActive }) =>
                  isActive ? 'header-link-active' : 'header-link'
                }
              >
                All Trends
              </NavLink>
            </AuthenticatedTemplate>
            {role === 'Admin' || role === 'Curator' ? (
              <>
                <NavLink
                  to='./archived-signals'
                  className={({ isActive }) =>
                    isActive ? 'header-link-active' : 'header-link'
                  }
                >
                  Archived Signals
                </NavLink>
                <NavLink
                  to='./archived-trends'
                  className={({ isActive }) =>
                    isActive ? 'header-link-active' : 'header-link'
                  }
                >
                  Archived Trends
                </NavLink>
              </>
            ) : null}
          </div>
          <div>
            <AuthenticatedTemplate>
              <div className='flex-div flex-vert-align-center'>
                <Dropdown
                  menu={{ items }}
                  placement='bottomRight'
                  className='undp-button-dropdown'
                  overlayClassName='undp-dropdown-menu'
                >
                  <div className='small-font'>Add A New</div>
                </Dropdown>
                <SignOutButton signOutClickHandler={signOutClickHandler} />
              </div>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <SignInButtonForHeader />
            </UnauthenticatedTemplate>
          </div>
        </div>
        <button
          type='button'
          className={
            showMenu ? 'undp-menu-hamburger is-active' : 'undp-menu-hamburger'
          }
          aria-label='menu-icon'
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        >
          <span className='undp-hamburger-line undp-line-top' />
          <span className='undp-hamburger-line undp-line-middle' />
          <span className='undp-hamburger-line undp-line-bottom' />
          Nav Toggle
        </button>
      </div>
      <div
        className={
          showMenu ? 'undp-mobile-nav mobile-nav-show' : 'undp-mobile-nav'
        }
      >
        <AuthenticatedTemplate>
          <div>
            <NavLink
              to='./signals'
              className={({ isActive }) =>
                isActive ? 'header-link-active' : 'header-link'
              }
              onClick={() => {
                setShowMenu(false);
              }}
            >
              All Signals
            </NavLink>
          </div>
          <div>
            <NavLink
              to='./trends'
              className={({ isActive }) =>
                isActive ? 'header-link-active' : 'header-link'
              }
              onClick={() => {
                setShowMenu(false);
              }}
            >
              All Trends
            </NavLink>
          </div>
        </AuthenticatedTemplate>
        {role === 'Admin' || role === 'Curator' ? (
          <div>
            <NavLink
              to='./archived-signals'
              className={({ isActive }) =>
                isActive ? 'header-link-active' : 'header-link'
              }
              onClick={() => {
                setShowMenu(false);
              }}
            >
              Archived Signals
            </NavLink>
          </div>
        ) : null}
        {role === 'Admin' || role === 'Curator' ? (
          <div>
            <NavLink
              to='./archived-trends'
              className={({ isActive }) =>
                isActive ? 'header-link-active' : 'header-link'
              }
              onClick={() => {
                setShowMenu(false);
              }}
            >
              Archived Trends
            </NavLink>
          </div>
        ) : null}
        <AuthenticatedTemplate>
          <div>
            <NavLink
              to='/add-new-signal'
              className={({ isActive }) =>
                isActive ? 'header-link-active' : 'header-link'
              }
              onClick={() => {
                setShowMenu(false);
              }}
            >
              Add new signal
            </NavLink>
          </div>
          {role === 'User' ? null : (
            <div>
              <NavLink
                to='/add-new-trend'
                className={({ isActive }) =>
                  isActive ? 'header-link-active' : 'header-link'
                }
                onClick={() => {
                  setShowMenu(false);
                }}
              >
                Add new trend
              </NavLink>
            </div>
          )}
          <SignOutButton mobileView signOutClickHandler={signOutClickHandler} />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <SignInButtonForHeader />
        </UnauthenticatedTemplate>
      </div>
    </header>
  );
}
