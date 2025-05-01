import { useContext } from 'react';
import Context from '../../Context/Context';
import { ProjectsCard } from '../../Components/ProjectCard';

export function ProjectsCardList() {
  const { signalList } = useContext(Context);
  if (signalList)
    return (
      <>
        {signalList.map((d, i) => (
          <ProjectsCard data={d} key={i} isDraft={d.status === 'Draft'} />
        ))}
      </>
    );
  return null;
}
