interface CollaboratorProps {
  name: string;
}

export function Collaborator(props: CollaboratorProps) {
  const { name } = props;
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className='collaborator-circle'
      role='button'
      tabIndex={0}
      onClick={() => console.log(`Clicked on collaborator: ${initial}`)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          console.log(`Activated collaborator: ${initial}`);
        }
      }}
      title={name}
    >
      {' '}
      {initial}{' '}
    </div>
  );
}
