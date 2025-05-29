import React from 'react';
import type { SignalDataType } from '../Types';
import type { MenuProps } from 'antd';
import { HeroCard } from './HeroCard';

interface SignalHeroProps {
  data: SignalDataType;
  isDraft?: boolean;
  role: string;
  menuItems: MenuProps['items'];
}

export function SignalHero({ data, isDraft, role, menuItems }: SignalHeroProps) {
  // Determine the URL as in SignalCard
  const url = isDraft
    ? `/signals/${data.id}/edit`
    : data.status === 'Archived'
    ? `/archived-signals/${data.id}`
    : `/signals/${data.id}`;

  return (
    <HeroCard
      title={data.headline}
      bgImage={data.attachment}
      menuItems={menuItems}
      url={url}
    >
      {/* Additional content can be passed as children if needed */}
      {/* <p className="undp-typography small-font margin-bottom-04">{data.description}</p>
      <div className="flex-div flex-wrap margin-bottom-07 gap-03">
        {data.keywords?.map((el, index) =>
          el !== '' ? (
            <div className="undp-chip" key={`keyword-${data.id}-${index}-${el}`}>
              {el}
            </div>
          ) : null
        )}
      </div> */}
    </HeroCard>
  );
}
