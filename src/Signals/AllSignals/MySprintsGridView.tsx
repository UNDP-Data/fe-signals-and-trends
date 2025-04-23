import { useContext } from 'react';
import Context from '../../Context/Context';
import { SprintCard } from '../../Components/SprintCard';

export function ProjectsCardList() {
  const { signalList } = useContext(Context);
  if (signalList)
    return (
      <>
        {signalList.map((d, i) => (
          <SprintCard data={d} key={i} isDraft={d.status === 'Draft'} />
        ))}
      </>
    );
  return null;
}
