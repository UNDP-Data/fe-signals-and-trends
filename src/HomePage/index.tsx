/* eslint-disable no-underscore-dangle */
import sortBy from 'lodash.sortby';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Background from '../assets/UNDP-hero-image.jpg';
import SSBannerImage from '../assets/ssBannerImage.jpg';
import FODBannerImage from '../assets/fodBannerImage.jpg';
import ThirdBannerImage from '../assets/ThirdBannerImage.png';
import { SignalDataType, TrendDataType } from '../Types';
import { TrendCard } from '../Components/TrendCard';
import { TrendsVis } from './TrendsVis';
import Context from '../Context/Context';
import { searchSignals, searchTrends } from '../API';

const HeroImageEl = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url(${Background}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

const Card01ImageEl = styled.div`
  background: url(${SSBannerImage}) no-repeat center;
  background-size: cover;
  flex-grow: 1;
  width: calc(33.33% - 3px);
  min-width: 20rem;
`;

const Card02ImageEl = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url(${FODBannerImage}) no-repeat center;
  background-size: cover;
  flex-grow: 1;
  width: calc(33.33% - 3px);
  min-width: 20rem;
`;

const Card03ImageEl = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url(${ThirdBannerImage}) no-repeat center;
  background-size: cover;
  flex-grow: 1;
  width: calc(33.33% - 3px);
  min-width: 20rem;
`;

const CardEl = styled.div`
  flex-grow: 1;
  color: var(--black);
  font-size: 1.4rem;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LinkH5 = styled.h5`
  color: var(--gray-700);
  font-weight: bold;
  &:hover {
    color: var(--red);
  }
`;

const SignalCardEl = styled.div`
  width: calc(33.33% - 4.67rem);
  padding: var(--spacing-07);
  background-color: var(--gray-200);
  @media (max-width: 800px) {
    width: calc(50% - 4.67rem);
  }
  @media (max-width: 600px) {
    width: calc(100% - 4.67rem);
  }
  &:hover {
    background-color: var(--gray-300);
  }
`;
const TrendCardEl = styled.div`
  width: 100%;
  @media (min-width: 1224px) {
    width: calc(50% - 4.5rem);
    padding: var(--spacing-07);
  }
  @media (min-width: 1820px) {
    width: calc(33.33% - 4.67rem);
    padding: var(--spacing-07);
  }
`;

const CardPEl = styled.p`
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-wrap: break-word;
  -webkit-box-orient: vertical;
`;

export function HomePage() {
  const [signalListing, setSignalList] = useState<undefined | SignalDataType[]>(
    undefined,
  );
  const [trendListing, setTrendList] = useState<undefined | TrendDataType[]>(
    undefined,
  );
  const { choices } = useContext(Context);
  useEffect(() => {
    searchSignals({ page: 1, per_page: 5, statuses: ['Approved'] })
      .then(response => {
        if (response) {
          setSignalList(
            sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
          );
        }
      })
      .catch(err => {
        if (err.response?.data.detail === 'No signal matches the parameters.') {
          setSignalList([]);
        }
      });
  }, []);
  useEffect(() => {
    searchTrends({ page: 1, per_page: 5, statuses: ['Approved'] })
      .then(response => {
        if (response) {
          setTrendList(
            sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
          );
        }
      })
      .catch(err => {
        if (err.response?.data.detail === 'No trend matches the parameters.') {
          setTrendList([]);
        }
      });
  }, []);
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <div style={{ maxWidth: '1272px' }}>
            <h1 className='undp-typography'>
              UNDP Future Trends and Signals System
            </h1>
            <h5 className='undp-typography'>
              The Future Trends and Signals System captures signals of change
              noticed across UNDP, and identifies the trends emerging – helping
              us all make stronger, more future-aware decisions.
            </h5>
          </div>
        </div>
      </HeroImageEl>
      <div
        className='margin-top-08'
        style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
      >
        {signalListing ? (
          <div
            className='flex-div flex-wrap margin-top-09'
            style={{ alignItems: 'stretch' }}
          >
            <SignalCardEl
              style={{ paddingTop: 0, backgroundColor: 'transparent' }}
            >
              <h2 className='undp-typography margin-top-05 margin-bottom-05'>
                Most Recent Signals
              </h2>
              <NavLink
                to='./signals'
                style={{
                  textDecoration: 'auto',
                  display: 'inline-block',
                  width: 'fit-content',
                }}
              >
                <div className='flex-div'>
                  <button
                    type='button'
                    className='undp-button button-tertiary button-arrow'
                  >
                    Explore All Signals
                  </button>
                </div>
              </NavLink>
            </SignalCardEl>
            {signalListing.map((d, i) => (
              <SignalCardEl
                key={i}
                style={{
                  display: 'flex',
                }}
              >
                <NavLink
                  to={`/signals/${d.id}`}
                  className='simplified-cards'
                  key={i}
                  style={{
                    textDecoration: 'none',
                    color: 'var(-gray-700)',
                    display: 'flex',
                  }}
                >
                  <CardEl>
                    <div>
                      <div style={{ padding: '0' }}>
                        <h6 className='undp-typography margin-bottom-07'>
                          Signal
                        </h6>
                        <LinkH5 className='undp-typography margin-bottom-05'>
                          {d.headline}
                        </LinkH5>
                        <CardPEl className='undp-typography small-font'>
                          {d.description}
                        </CardPEl>
                      </div>
                    </div>
                    <div className='margin-top-07'>
                      <div>
                        <button
                          type='button'
                          className='undp-button button-tertiary button-arrow padding-top-00 padding-bottom-00'
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </CardEl>
                </NavLink>
              </SignalCardEl>
            ))}
          </div>
        ) : (
          <div className='undp-loader-container'>
            <div className='undp-loader' />
          </div>
        )}
        {trendListing ? (
          <div
            className='flex-div flex-wrap margin-top-13 padding-bottom-13'
            style={{ alignItems: 'stretch' }}
          >
            <TrendCardEl
              style={{ paddingTop: 0, backgroundColor: 'transparent' }}
            >
              <h2 className='undp-typography margin-top-05 margin-bottom-05'>
                Most Recent Trends
              </h2>
              <NavLink
                to='./trends'
                style={{
                  textDecoration: 'auto',
                  display: 'inline-block',
                  width: 'fit-content',
                }}
              >
                <div className='flex-div'>
                  <button
                    type='button'
                    className='undp-button button-tertiary button-arrow'
                  >
                    Explore All Trends
                  </button>
                </div>
              </NavLink>
            </TrendCardEl>
            {trendListing.map((d, i) => (
              <TrendCard key={i} data={d} forHomePage />
            ))}
          </div>
        ) : (
          <div className='undp-loader-container'>
            <div className='undp-loader' />
          </div>
        )}
        {choices ? (
          <TrendsVis />
        ) : (
          <div className='undp-loader-container'>
            <div className='undp-loader' />
          </div>
        )}
        <div
          className='flex-div flex-wrap'
          style={{ alignItems: 'stretch', gap: '4px', margin: '0 -1rem' }}
        >
          <Card01ImageEl>
            <div
              style={{
                padding: 'var(--spacing-13) var(--spacing-07)',
                color: 'var(--white)',
              }}
            >
              <h2 className='undp-typography margin-bottom-03'>
                Signals Spotlight
              </h2>
              <h5 className='undp-typography margin-bottom-07'>
                The UNDP Signals Spotlight highlights some of the signals and
                trends that we consider will be significant for development.
                Inspired by some 500 signals of change observed by UNDP
                colleagues around the world, the Spotlight highlights some of
                the most interesting and traces the patterns and trends they
                reveal
              </h5>
              <a
                href='https://www.undp.org/future-development/signals-spotlight'
                target='_blank'
                style={{
                  textDecoration: 'auto',
                  display: 'inline-block',
                  width: 'fit-content',
                }}
                rel='noreferrer'
              >
                <button
                  type='button'
                  className='undp-button button-primary button-arrow'
                >
                  See Full Report
                </button>
              </a>
            </div>
          </Card01ImageEl>
          <Card02ImageEl>
            <div
              style={{
                padding: 'var(--spacing-13) var(--spacing-07)',
                color: 'var(--white)',
              }}
            >
              <h2 className='undp-typography margin-bottom-03'>
                Future of Development
              </h2>
              <h5 className='undp-typography margin-bottom-07'>
                Explore our vision for a brighter future. Learn how we are
                imagining the future of development and sharing our ideas for
                progress towards a more sustainable and equitable tomorrow.
              </h5>
              <a
                href='https://www.undp.org/future-development'
                target='_blank'
                style={{
                  textDecoration: 'auto',
                  display: 'inline-block',
                  width: 'fit-content',
                }}
                rel='noreferrer'
              >
                <button
                  type='button'
                  className='undp-button button-primary button-arrow'
                >
                  Explore More
                </button>
              </a>
            </div>
          </Card02ImageEl>
          <Card03ImageEl>
            <div
              style={{
                padding: 'var(--spacing-13) var(--spacing-07)',
                color: 'var(--white)',
              }}
            >
              <h2 className='undp-typography margin-bottom-03'>
                Using the Future Trends and Signals System (FTSS)
              </h2>
              <h5 className='undp-typography margin-bottom-07'>
                Explore UNDP&apos;s Futures Portal and gain access to FTSS user
                guides and case studies demonstrating the system&apos;s use
                across the organization. Take an active role by registering as a
                signal scanner and inspire your colleagues to join our Futures
                Network!
              </h5>
              <a
                href='https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fundp.sharepoint.com%2Fsites%2FFutures-Portal%2FSitePages%2FUNDP-Future-Trends-and-Signals-System.aspx&data=05%7C02%7Cmustafa.saifee%40undp.org%7C38467ed9fbcf48e461e408dc016e9680%7Cb3e5db5e2944483799f57488ace54319%7C0%7C0%7C638386821682838151%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&sdata=fq9HJsEqpZ%2BiHb7PZhx9lGqutygbY4mf7f3aLn6WL88%3D&reserved=0'
                target='_blank'
                style={{
                  textDecoration: 'auto',
                  display: 'inline-block',
                  width: 'fit-content',
                }}
                rel='noreferrer'
              >
                <button
                  type='button'
                  className='undp-button button-primary button-arrow'
                >
                  Explore More
                </button>
              </a>
            </div>
          </Card03ImageEl>
        </div>
      </div>
    </>
  );
}
