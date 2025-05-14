import React from 'react';
import styled from 'styled-components';
import { Typography, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Background from '../assets/UNDP-hero-image.jpg';
import { OptionsDropdown } from './OptionsDropdown';

const { Title, Text } = Typography;

interface HeroImageProps {
  bgImage?: string;
}

const HeroImageEl = styled.div<HeroImageProps>`
  background: ${props =>
    props.bgImage && props.bgImage !== '' ? `url(${props.bgImage})` : `url(${Background})`}
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

const HeroHeader = styled.div`
  background-color: #F7F7F7;
  border-bottom: 1px solid #D4D6D8;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const HeroTitle = styled(Title)`
  margin: 0 !important;
  font-size: 22px !important;
  
  &:hover {
    color: #006EB5 !important;
  }
`;

const HeroContent = styled.div`
  padding: 20px;
`;

const TimeAgoText = styled(Text)`
  color: #8c8c8c;
  font-size: 14px;
  font-style: italic;
  margin-bottom: 8px;
  display: block;
`;

const MenuButton = styled.div`
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const HeroHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  flex-wrap: nowrap;
  width: 100%;

  .hero-header-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1 1 0;
    min-width: 0;
  }
  .hero-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 0 0 auto;
  }
`;

interface HeroCardProps {
  title: string;
  timeAgo?: string;
  bgImage?: string;
  menuItems?: MenuProps['items'];
  url?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function HeroCard({ 
  title, 
  timeAgo, 
  bgImage, 
  menuItems, 
  url, 
  onClick,
  children 
}: HeroCardProps) {
//   const handleTitleClick = (e: React.MouseEvent) => {
//     if (onClick) {
//       e.preventDefault();
//       onClick();
//     }
//   };

  return (
    <div className="hero-card">
      {bgImage !== undefined && (
        <a href={url || '#'} style={{ textDecoration: 'none' }}>
          <HeroImageEl bgImage={bgImage} />
        </a>
      )}
      <HeroHeader>
        <HeroHeaderContent>
          <div className="hero-header-left">
            {url ? (
              <a href={url} style={{ textDecoration: 'none', color: 'inherit' }}>
                <HeroTitle level={3}>{title}</HeroTitle>
              </a>
            ) : (
              <HeroTitle level={3}>{title}</HeroTitle>
            )}
            {timeAgo && <TimeAgoText>{timeAgo}</TimeAgoText>}
          </div>
          {menuItems && (
            <div className="hero-header-right">
              <OptionsDropdown menuItems={menuItems} />
            </div>
          )}
        </HeroHeaderContent>
        {children}
      </HeroHeader>
    </div>
  );
}
