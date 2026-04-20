import styled from 'styled-components';
import { Modal, message, Popconfirm, Tooltip } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import UNDPColorModule from 'undp-viz-colors';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { DeleteOutlined } from '@ant-design/icons';
import { SignalDataType } from '../Types';
import Background from '../assets/UNDP-hero-image.jpg';
import Context from '../Context/Context';

import '../styles.css';
import { ChipEl } from './ChipEl';
import { getfavoriteSignals, searchUsers, deleteSignal } from '../API';
import { Collaborator } from './Collaborator';

interface Props {
  data: SignalDataType;
  isDraft?: boolean;
}

interface HeroImageProps {
  bgImage?: string;
}

const IconContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 0.5rem;
  padding: 0.5rem;
`;
const HeroImageEl = styled.div<HeroImageProps>`
  background: ${props =>
    props.bgImage ? `url(${props.bgImage})` : `url(${Background})`}
    no-repeat center;
  background-size: cover;
  width: 100%;
  height: 0;
  padding-bottom: 55%;
  filter: brightness(100%);
  &:hover {
    filter: brightness(80%);
    transition: filter 0.2s;
  }
`;

const CardEl = styled.div`
  max-width: 100%;
  flex-grow: 1;
  font-size: 1.4rem;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 1rem;
`;

const DescriptionEl = styled.p`
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-wrap: break-word;
  -webkit-box-orient: vertical;
`;

const LinkP = styled.p`
  color: var(--gray-700);
  &:hover {
    color: var(--red);
  }
`;

export function ProjectsCard(props: Props) {
  const { data, isDraft } = props;
  const { role, choices, updateCardsToPrint, cardsToPrint, userID, userName } =
    useContext(Context);
  const [isFilled, setIsFilled] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Check if current user is the admin (creator) of this signal
  const isAdmin =
    // Check if user is admin role
    role === 'Admin' ||
    // Check if user is the creator of the signal
    (data.created_by === userName);

  // Function to handle signal deletion
  const handleDeleteSignal = async () => {
    if (!isAdmin) {
      messageApi.error("Permission denied: Only signal creators or admins can delete signals");
      return;
    }

    try {
      messageApi.loading("Deleting signal...");
      await deleteSignal(data.id);
      messageApi.success("Signal deleted successfully");

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete signal:", error);
      messageApi.error("Failed to delete signal");
    }
  };

  //   Need to remove this?
  const myFavBtnClick = () => {
    const signals = getfavoriteSignals();
    setIsFilled(!isFilled);
  };
  //   const [users, setUsers] = useState<UserSearchResponseDataType[]>([]);
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState<string | null>(null);
  const fetchUsers = async () => {
    const userData = await searchUsers();
    // setLoading(true);
    // setError(null);
    // try {
    //   const userData = await searchUsers();
    //   //   setUsers(userData);
    // } catch (err) {
    //   setError('Failed to fetch users. Please try again later.');
    // } finally {
    //   setLoading(false);
    // }
  };
  const [openModal, setOpenModal] = useState(false);
  //   const [collaborators, setCollaborators] = useState<string[]>(['Alpha', 'Beta', 'Charlie']);
  const [collaborators] = useState<string[]>(['Alpha', 'Beta', 'Charlie']);
  const addCollaborator = () => {
    setOpenModal(true);
    // const newCollaboratorInitial = prompt('Enter new collaborator initial:');
    // if (newCollaboratorInitial) {
    //   setCollaborators([...collaborators, newCollaboratorInitial]);
    // }
  };
  useEffect(() => {
    if (openModal) {
      fetchUsers();
    }
  }, [openModal]);
  return (
    <div className='signal-card'>
      {contextHolder} {/* Add message API contextHolder */}
      <CardEl>
        <div>
          <NavLink
            to={
              isDraft
                ? `/signals/${data.id}/edit`
                : data.status === 'Archived'
                  ? `/archived-signals/${data.id}`
                  : `/signals/${data.id}`
            }
            style={{
              textDecoration: 'none',
            }}
          >
            <HeroImageEl bgImage={data.attachment}>
              {role === 'Admin' || role === 'Curator' ? (
                <div
                  className={`undp-chip margin-bottom-05 ${data.status === 'Approved'
                      ? 'undp-chip-green'
                      : data.status === 'New'
                        ? 'undp-chip-yellow'
                        : 'undp-chip-red'
                    }`}
                  style={{
                    borderRadius: '0 0.5rem 0.5rem 0',
                    marginTop: '1.5rem',
                    color: 'var(--black)',
                  }}
                >
                  {data.status === 'New' ? 'Awaiting Approval' : data.status}
                </div>
              ) : null}
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                {/* Delete button - only visible to admins and creators */}
                {isAdmin && (
                  <Popconfirm
                    title="Delete this signal?"
                    description="This action cannot be undone."
                    onConfirm={handleDeleteSignal}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <button
                      type='button'
                      onClick={e => {
                        e.preventDefault(); // Prevent navigation
                      }}
                      style={{
                        border: 'none',
                        background: 'rgba(255, 255, 255, 0.85)',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        marginRight: '5px',
                      }}
                    >
                      <DeleteOutlined style={{ color: 'red', fontSize: '1.2em' }} />
                    </button>
                  </Popconfirm>
                )}

                {/* Favorite button */}
                <button
                  type='button'
                  onClick={e => {
                    e.preventDefault();
                    myFavBtnClick();
                  }}
                  style={{
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.85)',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                  }}
                >
                  <FontAwesomeIcon
                    icon={isFilled ? solidHeart : regularHeart}
                    style={{
                      color: isFilled ? 'orange' : 'black',
                      fontSize: '1.2em',
                    }}
                  />
                </button>
              </div>
            </HeroImageEl>
          </NavLink>
          <div style={{ padding: '1rem 1rem 0 1rem' }}>
            <div className='flex-div flex-wrap'>
              <ChipEl
                text={
                  data.steep_primary
                    ? data.steep_primary.split(' – ')[0]
                    : 'No tags'
                }
                circleColor={
                  data.steep_primary
                    ? !choices
                      ? 'var(--black)'
                      : UNDPColorModule.categoricalColors.colors[
                      choices?.steep.findIndex(
                        el => el === data.steep_primary,
                      )
                      ]
                    : 'var(--gray-600)'
                }
              />
              {data.steep_secondary
                ?.filter(s => s !== data.steep_primary)
                .map((s, j) => (
                  <ChipEl
                    key={j}
                    text={s.split(' – ')[0]}
                    circleColor={
                      !choices
                        ? 'var(--black)'
                        : UNDPColorModule.categoricalColors.colors[
                        choices?.steep.findIndex(el => el === s)
                        ]
                    }
                  />
                ))}
            </div>
            <NavLink
              to={
                isDraft
                  ? `/signals/${data.id}/edit`
                  : data.status === 'Archived'
                    ? `/archived-signals/${data.id}`
                    : `/signals/${data.id}`
              }
              style={{
                textDecoration: 'none',
              }}
            >
              <LinkP className='bold undp-typography margin-top-05 margin-bottom-03'>
                {data.headline}{' '}
                <span
                  style={{
                    fontSize: '1rem',
                    color: 'var(--gray-600)',
                    fontWeight: 'normal',
                  }}
                >
                  (ID:{data.id})
                </span>
              </LinkP>
            </NavLink>
            <DescriptionEl className='undp-typography small-font margin-bottom-04'>
              {data.description}
            </DescriptionEl>
            <p className='small-font undp-typography bold margin-bottom-03 margin-top-03'>
              Keywords
            </p>
            <div className='flex-div flex-wrap margin-bottom-07 gap-03'>
              {data.keywords?.map((el, j) =>
                el !== '' ? (
                  <div className='undp-chip' key={`chip-${j}`}>
                    {el}
                  </div>
                ) : null,
              )}
            </div>
            <p className='small-font undp-typography bold margin-bottom-03 margin-top-03'>
              Collaborators
            </p>
            <div className='collaborator-card'>
              {collaborators.map((name, index) => (
                <Collaborator key={index} name={name} />
              ))}
              <div
                className='collaborator-circle add-collaborator'
                role='button'
                tabIndex={0}
                onClick={addCollaborator}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    addCollaborator();
                  }
                }}
                title='Add Collaborator'
              >
                +
              </div>
              <Modal open={openModal} onCancel={() => setOpenModal(false)}>
                {' '}
                <h2>Add Collaborator</h2>{' '}
              </Modal>
            </div>
          </div>
        </div>
        <div>
          <div
            className='flex-div gap-00'
            style={{
              justifyContent: 'space-between',
              borderTop: '1px solid var(--gray-400)',
              margin: '1.5rem 0 0 0',
              padding: '0',
            }}
          >
            <NavLink
              to={
                isDraft
                  ? `/signals/${data.id}/edit`
                  : data.status === 'Archived'
                    ? `/archived-signals/${data.id}`
                    : `/signals/${data.id}`
              }
              style={{
                textDecoration: 'none',
                borderRight: '1px solid var(--gray-400)',
                flexGrow: 1,
                marginBottom: '-1rem',
                paddingBottom: 0,
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <button
                className='undp-button button-tertiary button-arrow'
                type='button'
              >
                {isDraft ? 'Edit Draft' : 'Read More'}
              </button>
            </NavLink>
            {isDraft ? null : (
              <button
                className={`undp-button button-tertiary button-arrow${cardsToPrint.findIndex(
                  el =>
                    el.id === `${data.id}` &&
                    el.mode === 'card' &&
                    el.type === 'signal',
                ) !== -1
                    ? 'disabled'
                    : ''
                  }`}
                disabled={
                  cardsToPrint.findIndex(
                    el =>
                      el.id === `${data.id}` &&
                      el.mode === 'card' &&
                      el.type === 'signal',
                  ) !== -1
                }
                style={{
                  opacity:
                    cardsToPrint.findIndex(
                      el =>
                        el.id === `${data.id}` &&
                        el.mode === 'card' &&
                        el.type === 'signal',
                    ) !== -1
                      ? 0.4
                      : 1,
                  cursor:
                    cardsToPrint.findIndex(
                      el =>
                        el.id === `${data.id}` &&
                        el.mode === 'card' &&
                        el.type === 'signal',
                    ) !== -1
                      ? 'not-allowed'
                      : 'pointer',
                  flexGrow: 1,
                  marginBottom: '-1rem',
                  paddingBottom: 0,
                }}
                type='button'
                onClick={e => {
                  e.stopPropagation();
                  if (
                    cardsToPrint.findIndex(
                      el =>
                        el.id === `${data.id}` &&
                        el.mode === 'card' &&
                        el.type === 'signal',
                    ) === -1
                  ) {
                    const cardToPrintTemp = [...cardsToPrint];
                    cardToPrintTemp.push({
                      type: 'signal',
                      mode: 'card',
                      id: `${data.id}`,
                    });
                    updateCardsToPrint(cardToPrintTemp);
                  }
                }}
              >
                {cardsToPrint.findIndex(
                  el =>
                    el.id === `${data.id}` &&
                    el.mode === 'card' &&
                    el.type === 'signal',
                ) === -1
                  ? 'Download'
                  : 'Added to PDF'}
              </button>
            )}
          </div>
        </div>
      </CardEl>
    </div>
  );
}
