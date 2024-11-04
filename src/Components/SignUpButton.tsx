import { useContext } from 'react';
import Context from '../Context/Context';
import { updateUser } from '../api';

interface Props {
  unit: string;
  accLabs: boolean;
  setOpenModal: (_d: boolean) => void;
  userRoleTemp: string;
}

export function SignUpButton(props: Props) {
  const { unit, setOpenModal, accLabs, userRoleTemp } = props;
  const { userName, name, userID, updateUnit, updateIsAcceleratorLab } =
    useContext(Context);
  return (
    <button
      type='button'
      className='undp-button button-primary button-arrow'
      onClick={() => {
        if (userID)
          updateUser(userID, {
            email: userName,
            name,
            unit,
            role: (userRoleTemp || 'User') as
              | 'Admin'
              | 'Curator'
              | 'User'
              | 'Visitor',
            id: userID,
            acclab: accLabs,
          }).then(() => {
            setOpenModal(false);
            updateUnit(unit);
            updateIsAcceleratorLab(accLabs);
          });
      }}
    >
      Sign Up
    </button>
  );
}
