import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { SignOutButton } from '../SignOutButton';
import Context from '../../Context/Context';

interface Props {
  signOutClickHandler: () => void;
}

export function LoggedInHeader(props: Props) {
  const { signOutClickHandler } = props;
  const { role } = useContext(Context);
  const [showMenu, setShowMenu] = useState(false);

  const ConciergeLink = () => {
    return (
      <a
        href='https://future-signals-concierge.vercel.app'
        target='_blank'
        rel='noopener noreferrer'
        className='header-link'
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          style={{ verticalAlign: 'middle' }}
        >
          <path
            d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Concierge
      </a>
    );
  };

  // Combined navigation items for the main dropdown
  const mainNavItems: MenuProps['items'] = [
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
      style: {
        display: role === 'Admin' || role === 'Curator' ? 'block' : 'none',
      },
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
      style: {
        display: role === 'Admin' || role === 'Curator' ? 'block' : 'none',
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'add-signal',
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
          Add New Signal
        </NavLink>
      ),
    },
    {
      key: 'add-trend',
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
          Add New Trend
        </NavLink>
      ),
    },
  ];

  return (
    <header className='undp-country-header'>
      <div className='undp-header-bg flex-space-between flex-div flex-vert-align-center'>
        <div className='flex-div flex-vert-align-center'>
          <NavLink
            to='./'
            style={{ textDecoration: 'none' }}
            className='logo-sub-head flex-div flex-vert-align-center'
          >
            <img
              src='https://design.undp.org/static/media/undp-logo-blue.4f32e17f.svg'
              alt='UNDP Logo'
              width='60'
              height='122'
            />
            <div className='undp-site-title'>
              <span
                style={{
                  borderBottom: '1px solid var(--gray-500)',
                  color: 'var(--gray-600)',
                  display: 'inline-block',
                  fontSize: '.75rem',
                  margin: 0,
                  marginBottom: 'var(--spacing-02)',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  fontWeight: 400,
                  paddingBottom: '1px',
                  textDecoration: 'none !important',
                }}
              >
                Data Futures Exchange
              </span>
              <span
                style={{
                  textDecoration: 'none',
                  color: 'var(--black)',
                  lineHeight: 1.25,
                }}
              >
                UNDP Future Trends and Signals System
              </span>
            </div>
          </NavLink>
        </div>
        <div
          className='undp-nav-div flex-div'
          style={{ justifyContent: 'space-between', flexGrow: 1 }}
        >
          <div
            className='flex-div gap-09'
            style={{ flexGrow: 1, justifyContent: 'center' }}
          >
            {/* Main navigation dropdown */}
            <Dropdown
              menu={{ items: mainNavItems }}
              placement='bottomCenter'
              className='undp-button-dropdown'
              overlayClassName='undp-dropdown-menu'
            >
              <div className='header-link'>Navigation</div>
            </Dropdown>

            {/* AI Concierge section */}
            <ConciergeLink />
          </div>
          <div>
            <div className='flex-div flex-vert-align-center'>
              <SignOutButton signOutClickHandler={signOutClickHandler} />
            </div>
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
        {/* Add AI Concierge link to mobile menu */}
        <div>
          <a
            href='https://chat.signals.data.undp.com'
            target='_blank'
            rel='noopener noreferrer'
            className='header-link'
            onClick={() => {
              setShowMenu(false);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                style={{ verticalAlign: 'middle' }}
              >
                <path
                  d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Concierge
            </div>
          </a>
        </div>
        <SignOutButton mobileView signOutClickHandler={signOutClickHandler} />
      </div>
    </header>
  );
}
