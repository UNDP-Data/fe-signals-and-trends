import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import UNDPColorModule from 'undp-viz-colors';
import { useContext, useState, useEffect } from 'react';
import { Dropdown, notification } from 'antd';
import type { MenuProps } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import type { SignalDataType } from '../Types';
import Background from '../assets/UNDP-hero-image.jpg';
import Context from '../Context/Context';
import { FavoriteButton } from './FavoriteButton';
import { addSignalToUserGroup } from '../API';

import '../styles.css';
import { ChipEl } from './ChipEl';
import { SignalCardActions } from './SignalCardActions';

interface Props {
  data: SignalDataType;
  isDraft?: boolean;
}

interface HeroImageProps {
  bgImage?: string;
}

// const IconContainer = styled.div`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   background: rgba(255, 255, 255, 0.85);
//   border-radius: 0.5rem;
//   padding: 0.5rem;
// `;
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

const MenuButton = styled.div`
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  margin-left: auto;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

export function SignalCard(props: Props) {
  const { data, isDraft } = props;
  const { role, choices, updateCardsToPrint, cardsToPrint, userGroups } =
    useContext(Context);
  const [groupsWithSignal, setGroupsWithSignal] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Check if the signal is already in any groups
  useEffect(() => {
    if (userGroups && userGroups.length > 0) {
      const signalGroups = userGroups.filter(group =>
        group.signal_ids?.includes(data.id)
      ).map(group => group.id);

      // Use functional update to prevent infinite loops
      setGroupsWithSignal(prev => {
        // Only update if actually different to prevent unnecessary renders
        if (JSON.stringify(prev) !== JSON.stringify(signalGroups)) {
          return signalGroups;
        }
        return prev;
      });
    }
  }, [userGroups, data.id]);
  
  const handleAddToUserGroup = (groupId: number) => {
    // If the signal is already in the group, don't do anything
    if (groupsWithSignal.includes(groupId)) {
      notification.info({
        message: 'Information',
        description: 'This signal is already in the selected group',
        placement: 'top',
        className: 'undp-notification',
      });
      return;
    }
    
    setLoading(true);
    addSignalToUserGroup(data.id, groupId)
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Signal added to user group successfully',
          placement: 'top',
          className: 'undp-notification',
        });
        
        // Update the list of groups containing this signal
        setGroupsWithSignal([...groupsWithSignal, groupId]);
      })
      .catch(error => {
        notification.error({
          message: 'Error',
          description: error.message || 'An error occurred while adding signal to user group',
          placement: 'top',
          className: 'undp-notification',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Create menu items for the dropdown
  const menuItems: MenuProps['items'] = [
    {
      key: 'favorite',
      label: (
        <FavoriteButton 
          signalId={data.id} 
          initialFavoriteStatus={data.favorite || false}
          size="small"
          inDropdown
        />
      ),
    },
    {
      type: 'divider',
    },
  ];

  // Add user groups to menu items
  if (userGroups && userGroups.length > 0) {
    const userGroupsSubmenu = userGroups.map(group => ({
      key: `group-${group.id}`,
      label: (
        <span>
          {group.name} {groupsWithSignal.includes(group.id) && '✓'}
        </span>
      ),
      disabled: groupsWithSignal.includes(group.id) || loading,
      onClick: () => handleAddToUserGroup(group.id),
    }));

    menuItems.push({
      key: 'user-groups',
      label: 'Add to Sprint',
      children: userGroupsSubmenu,
    });
  } else {
    menuItems.push({
      key: 'no-groups',
      label: 'No Groups Available',
      disabled: true,
    });
  }

  return (
    <div className='signal-card'>
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
                  className={`undp-chip margin-bottom-05 ${
                    data.status === 'Approved'
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
            </HeroImageEl>
          </NavLink>
          
          <div style={{ padding: '1rem 1rem 0 1rem' }}>
            <div
              className="flex-div"
              style={{
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', flexGrow: 1 }}>
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
                  .map((s, index) => (
                    <ChipEl
                      key={`steep-${data.id}-${index}-${s}`}
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
              <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <MenuButton onClick={e => e.preventDefault()}>
                  <EllipsisOutlined style={{ fontSize: '24px' }} />
                </MenuButton>
              </Dropdown>
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
              {data.keywords?.map((el, index) =>
                el !== '' ? (
                  <div className='undp-chip' key={`keyword-${data.id}-${index}-${el}`}>
                    {el}
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
        <SignalCardActions 
          data={data}
          isDraft={isDraft}
          cardsToPrint={cardsToPrint}
          updateCardsToPrint={updateCardsToPrint}
        />
      </CardEl>
    </div>
  );
}