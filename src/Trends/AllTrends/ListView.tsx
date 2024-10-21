import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useContext } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import Context from '../../Context/Context';
import { ImpactCircleEl } from '../../Components/ImpactRatingEl';
import { ChipEl } from '../../Components/ChipEl';

const TableRowEl = styled.div`
  cursor: pointer;
`;

const DescriptionEl = styled.div`
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-wrap: break-word;
  -webkit-box-orient: vertical;
`;

const CellDiv = styled.div`
  padding: 0 2.5rem 0 0.75rem;
`;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate().toString()}-${d.toLocaleString('en-US', {
    month: 'short',
  })}-${d.getFullYear().toString()}`;
}

export function ListView() {
  const { choices, trendList } = useContext(Context);
  const navigate = useNavigate();
  return (
    <div
      style={{ overflow: 'auto', maxHeight: '70vh' }}
      className='undp-scrollbar'
    >
      <div className='undp-table-head undp-table-head-sticky'>
        <div
          style={{ width: '32.5%', minWidth: '30rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>Trends</CellDiv>
        </div>
        <div
          style={{ width: '15%', minWidth: '10rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>Time Horizon</CellDiv>
        </div>
        <div
          style={{ width: '5%', minWidth: '10rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>Impact Rating</CellDiv>
        </div>
        <div
          style={{ width: '30%', minWidth: '20rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>Impact Description</CellDiv>
        </div>
        <div
          style={{ width: '10%', minWidth: '6rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>Date created</CellDiv>
        </div>
        <div
          style={{ width: '5%', minWidth: '3rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>ID</CellDiv>
        </div>
      </div>
      {trendList?.map((d, i) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <TableRowEl
          className='undp-table-row'
          key={i}
          onClick={() => {
            navigate(
              d.status === 'Archived'
                ? `/archived-trends/${d.id}`
                : `/trends/${d.id}`,
            );
          }}
        >
          <div
            style={{ width: '32.5%', minWidth: '30rem' }}
            className='undp-table-row-cell'
          >
            <CellDiv>
              <p className='undp-typography margin-bottom-02 small-font bold'>
                {d.headline}
              </p>
              <DescriptionEl className='small-font'>
                {d.description}
              </DescriptionEl>
            </CellDiv>
          </div>
          <div
            style={{ width: '15%', minWidth: '10rem' }}
            className='undp-table-row-cell'
          >
            <CellDiv>
              {d.time_horizon ? (
                <ChipEl
                  text={d.time_horizon}
                  circleColor={
                    !choices
                      ? 'var(--black)'
                      : UNDPColorModule.categoricalColors.colors[
                          8 -
                            (choices?.horizons.findIndex(
                              el => el === d.time_horizon,
                            ) as number)
                        ]
                  }
                />
              ) : null}
            </CellDiv>
          </div>
          <div
            style={{ width: '5%', minWidth: '10rem' }}
            className='undp-table-row-cell'
          >
            <CellDiv>
              {d.impact_rating ? (
                <ImpactCircleEl impact={d.impact_rating} />
              ) : null}
            </CellDiv>
          </div>
          <div
            style={{ width: '30%', minWidth: '20rem' }}
            className='undp-table-row-cell small-font'
          >
            <CellDiv>{d.impact_description}</CellDiv>
          </div>
          <div
            style={{ width: '10%', minWidth: '6rem' }}
            className='undp-table-row-cell'
          >
            <CellDiv>
              <p className='small-font'>{formatDate(d.created_at)}</p>
            </CellDiv>
          </div>
          <div
            style={{ width: '5%', minWidth: '3rem' }}
            className='undp-table-row-cell'
          >
            <CellDiv>
              <p className='small-font'>{d.id}</p>
            </CellDiv>
          </div>
        </TableRowEl>
      ))}
    </div>
  );
}
