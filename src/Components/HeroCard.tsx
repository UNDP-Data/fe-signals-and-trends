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

const CardWrapper = styled.div`
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardLink = styled.a`
  display: block;
  text-decoration: none;
  color: inherit;
`;

const MenuWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
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
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const content = (
    <>
      {bgImage !== undefined && (
        <HeroImageEl bgImage={bgImage} />
      )}
      <HeroHeader>
        <HeroHeaderContent>
          <div className="hero-header-left">
            <HeroTitle level={3}>{title}</HeroTitle>
            {timeAgo && <TimeAgoText>{timeAgo}</TimeAgoText>}
          </div>
        </HeroHeaderContent>
        {children}
      </HeroHeader>
    </>
  );

  if (url) {
    return (
      <CardWrapper className="hero-card">
        <CardLink href={url} onClick={handleClick}>
          {content}
        </CardLink>
        {menuItems && (
          <MenuWrapper>
            <OptionsDropdown menuItems={menuItems} />
          </MenuWrapper>
        )}
      </CardWrapper>
    );
  }

  return (
    <CardWrapper className="hero-card">
      {content}
      {menuItems && (
        <div className="hero-header-right" style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <OptionsDropdown menuItems={menuItems} />
        </div>
      )}
    </CardWrapper>
  );
}
