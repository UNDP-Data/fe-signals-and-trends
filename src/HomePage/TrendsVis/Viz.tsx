/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import {
  forceCollide,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';
import { scaleOrdinal } from 'd3-scale';
import { useNavigate } from 'react-router-dom';
import UNDPColorModule from 'undp-viz-colors';
import Context from '../../Context/Context';
import { TrendDataType } from '../../Types';
import { searchTrends } from '../../api';

interface Props {
  svgWidth: number;
  svgHeight: number;
  showGroups: boolean;
}

interface DotHoveredProps {
  title: string;
  noOfSignals: number;
  xPosition: number;
  yPosition: number;
}

interface TooltipElProps {
  x: number;
  y: number;
}

interface VisTrendDataType extends TrendDataType {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 1000;
  background-color: var(--gray-200);
  word-wrap: break-word;
  top: ${props => props.y - 17}px;
  left: ${props => props.x}px;
  transform: translate(-50%, -100%);
  padding: 0.5rem;
`;

export function Viz(props: Props) {
  const { svgWidth, svgHeight, showGroups } = props;
  const [trendsList, setTrendsList] = useState<undefined | VisTrendDataType[]>(
    undefined,
  );
  const [nodesList, setNodesList] = useState<undefined | VisTrendDataType[]>(
    undefined,
  );
  const [hoveredDot, setHoveredDot] = useState<null | DotHoveredProps>(null);
  const [error, setError] = useState<undefined | string>(undefined);
  const { choices } = useContext(Context);
  const margin = {
    top: 75,
    bottom: 25,
    left: 100,
    right: 25,
  };
  const gridSize = {
    width: (svgWidth - margin.left - margin.right) / 3,
    height: (svgHeight - margin.top - margin.bottom) / 3,
  };
  const radius = 7;

  const navigate = useNavigate();
  const xCenter = scaleOrdinal()
    .domain(choices?.horizon as string[])
    .range([gridSize.width * 0.5, 1.5 * gridSize.width, 2.5 * gridSize.width]);
  const yCenter = scaleOrdinal()
    .domain(choices?.rating as string[])
    .range([
      gridSize.height * 2.5,
      1.5 * gridSize.height,
      0.5 * gridSize.height,
    ]);

  useEffect(() => {
    setTrendsList([]);
    setNodesList(undefined);
    setError(undefined);
    searchTrends({ per_page: 500 })
      .then(response => {
        setTrendsList(response.data as VisTrendDataType[]);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setTrendsList([]);
        } else {
          setError(
            `${err}. ${
              err.response?.status === 500
                ? 'Please try again in some time'
                : ''
            }`,
          );
        }
      });
  }, []);
  useEffect(() => {
    const simulation = forceSimulation(trendsList)
      .force('charge', forceManyBody().strength(5))
      .force(
        'x',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        forceX().x((d: any) => xCenter(d.time_horizon) as any),
      );
    if (showGroups) {
      simulation.force(
        'y',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        forceY().y((d: any) => yCenter(d.impact_rating) as any),
      );
    } else {
      simulation.force('y', forceY().y(svgHeight / 2));
    }
    simulation.force('collision', forceCollide().radius(radius)).tick(100);
    simulation.on('tick', () => {
      setNodesList([...simulation.nodes()]);
    });
    simulation.alpha(0.5);
  }, [showGroups, trendsList]);
  return (
    <div>
      {choices ? (
        <>
          {nodesList ? (
            <svg
              width='calc(100% - 2rem)'
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            >
              <g transform={`translate(${margin.left},${margin.top})`}>
                {nodesList.map((d, i) => (
                  <circle
                    key={i}
                    r={radius}
                    cx={d.x}
                    cy={d.y}
                    style={{
                      fill: !choices
                        ? 'var(--black)'
                        : UNDPColorModule.categoricalColors.colors[
                            choices?.steep.findIndex(
                              el => el === d.steep_primary,
                            )
                          ],
                      cursor: 'pointer',
                    }}
                    onMouseEnter={event => {
                      setHoveredDot({
                        title: d.headline,
                        noOfSignals: d.connected_signals?.length || 0,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredDot(null);
                    }}
                    onClick={() => {
                      navigate(`/trends/${d.id}`);
                    }}
                    opacity={
                      hoveredDot
                        ? hoveredDot.title === d.headline
                          ? 1
                          : 0.3
                        : 1
                    }
                  />
                ))}
              </g>
              <g transform={`translate(${margin.left},80)`}>
                {choices.horizon.map((d, i) => (
                  <text
                    key={i}
                    x={xCenter(d) as number}
                    textAnchor='middle'
                    style={{ textTransform: 'uppercase' }}
                    fontSize='1rem'
                    fontWeight='bold'
                  >
                    {d}
                  </text>
                ))}
              </g>
              {showGroups ? (
                <g transform={`translate(60,${margin.top})`}>
                  {choices.rating.map((d, i) => (
                    <g
                      key={i}
                      transform={`translate(30,${yCenter(d) as number})`}
                    >
                      <text
                        key={i}
                        textAnchor='middle'
                        style={{ textTransform: 'uppercase' }}
                        fontSize='1rem'
                        fontWeight='bold'
                      >
                        <tspan dy='0' x='0'>
                          IMPACT {d.split('–')[0]}
                        </tspan>
                        <tspan dy='18' x='0'>
                          {d.split('–')[1]}
                        </tspan>
                      </text>
                    </g>
                  ))}
                </g>
              ) : null}
            </svg>
          ) : error ? (
            <p
              className='margin-top-00 margin-bottom-00'
              style={{ color: 'var(--dark-red)' }}
            >
              {error}
            </p>
          ) : (
            <div className='undp-loader-container'>
              <div className='undp-loader' />
            </div>
          )}
          {hoveredDot ? (
            <TooltipEl x={hoveredDot.xPosition} y={hoveredDot.yPosition}>
              <p
                className='undp-typography margin-bottom-00 margin-top-00'
                style={{ fontSize: '1rem' }}
              >
                {hoveredDot.title} ({hoveredDot.noOfSignals} signals)
              </p>
            </TooltipEl>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
