import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { SignInButtonForHeader } from '../SignInButtonForHeader';

export function LoggedOutHeader() {
  const [showMenu, setShowMenu] = useState(false);
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
          style={{ justifyContent: 'space-between' }}
        >
          <SignInButtonForHeader />
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
        <SignInButtonForHeader />
      </div>
    </header>
  );
}
