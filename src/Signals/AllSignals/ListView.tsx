import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useContext } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { SSCOLOR } from '../../Constants';
import Context from '../../Context/Context';
import { ChipEl } from '../../Components/ChipEl';
import { getSDGIcon } from '../../Utils/GetSDGIcons';

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
  const { choices, signalList } = useContext(Context);
  const navigate = useNavigate();
  return (
    <div
      style={{ width: '100%', overflow: 'auto', maxHeight: '70vh' }}
      className='undp-scrollbar'
    >
      <div className='undp-table-head undp-table-head-sticky'>
        <div
          style={{ width: '25%', minWidth: '20rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>Signal</CellDiv>
        </div>
        <div
          style={{ width: '12.5%', minWidth: '10rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>STEEP+V</CellDiv>
        </div>
        <div
          style={{ width: '20%', minWidth: '12rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>Signature solutions</CellDiv>
        </div>
        <div
          style={{ width: '15%', minWidth: '15rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>SDGs</CellDiv>
        </div>
        <div
          style={{ width: '12.5%', minWidth: '15rem' }}
          className='undp-table-head-cell'
        >
          <CellDiv>Keywords</CellDiv>
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
      {signalList?.map((d, i) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <TableRowEl
          className='undp-table-row'
          key={i}
          onClick={() => {
            // eslint-disable-next-line no-underscore-dangle
            navigate(
              d.status === 'Archived'
                ? `/archived-signals/${d.id}`
                : `/signals/${d.id}`,
            );
          }}
        >
          <div
            style={{ width: '25%', minWidth: '20rem' }}
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
            style={{ width: '12.5%', minWidth: '10rem' }}
            className='undp-table-row-cell'
          >
            {d.steep_primary ? (
              <CellDiv>
                <div className='flex-div flex-wrap'>
                  <ChipEl
                    circleColor={
                      !choices
                        ? 'var(--black)'
                        : UNDPColorModule.categoricalColors.colors[
                            choices?.steepv.findIndex(
                              el => el === d.steep_primary,
                            )
                          ]
                    }
                    text={d.steep_primary.split(' – ')[0]}
                  />
                  {d.steep_secondary
                    ?.filter(el => el !== d.steep_primary)
                    .map((el, j) => (
                      <ChipEl
                        key={j}
                        circleColor={
                          !choices
                            ? 'var(--black)'
                            : UNDPColorModule.categoricalColors.colors[
                                choices?.steepv.findIndex(c => c === el)
                              ]
                        }
                        text={el.split(' – ')[0]}
                      />
                    ))}
                </div>
              </CellDiv>
            ) : null}
          </div>
          <div
            style={{ width: '20%', minWidth: '12rem' }}
            className='undp-table-row-cell'
          >
            <CellDiv>
              <div className='flex-div flex-wrap'>
                {d.signature_primary !== '' && d.signature_primary ? (
                  <ChipEl
                    circleColor={
                      choices
                        ? SSCOLOR[
                            choices.signatures.findIndex(
                              el => el === d.signature_primary,
                            )
                          ].textColor
                        : 'var(--black)'
                    }
                    text={d.signature_primary}
                  />
                ) : null}
                {d.signature_secondary
                  ?.filter(el => el !== d.signature_primary)
                  .map((el, j) => (
                    <ChipEl
                      text={el}
                      key={j}
                      circleColor={
                        !choices
                          ? 'var(--black)'
                          : SSCOLOR[
                              choices.signatures.findIndex(sig => sig === el)
                            ].textColor
                      }
                    />
                  ))}
              </div>
            </CellDiv>
          </div>
          <div
            style={{ width: '15%', minWidth: '15rem' }}
            className='undp-table-row-cell'
          >
            <CellDiv>
              <div className='flex-div flex-wrap gap-03'>
                {d.sdgs && d.sdgs.length > 0 ? (
                  <>
                    {d.sdgs.map((sdg, j) => (
                      <div key={j}>{getSDGIcon(sdg.split(':')[0], 48)}</div>
                    ))}
                  </>
                ) : null}
              </div>
            </CellDiv>
          </div>
          <div
            style={{ width: '12.5%', minWidth: '15rem' }}
            className='undp-table-row-cell'
          >
            <CellDiv>
              <div className='flex-div flex-wrap'>
                {d.keywords?.map((el, j) =>
                  el !== '' ? (
                    <div className='undp-chip' key={`chip-${j}`}>
                      {el}
                    </div>
                  ) : null,
                )}
              </div>
            </CellDiv>
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
