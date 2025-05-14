import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { UserGroupDataType } from '../Types';
import { listUserGroups } from '../API';
import { UserGroupResponseDataType } from '../API/userCalls';

interface SprintSelectProps {
  value?: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  helpText?: string;
  className?: string;
  style?: React.CSSProperties;
  status?: '' | 'error' | 'warning';
  id?: string;
}

export function SprintSelect({
  value = [],
  onChange,
  placeholder = 'Select sprints',
  helpText = 'Select one or more sprints you want to add this item to. You can only select sprints that you are a member of.',
  className = 'undp-select',
  style,
  status,
  id,
}: SprintSelectProps) {
  // Ensure value is always an array of numbers
  const safeValue = Array.isArray(value) ? 
    value.filter(v => typeof v === 'number') : // Keep only numeric values
    [];
  const [userGroups, setUserGroups] = useState<UserGroupResponseDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  // Fetch user groups that the current user is a member of
  useEffect(() => {
    setLoading(true);
    listUserGroups()
      .then(response => {
        setUserGroups(response);
        setLoading(false);
      })
      .catch(err => {
        setError(
          `${err}. ${err.response?.status === 500
            ? 'Please try again in some time'
            : ''
          }`,
        );
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Select
        id={id}
        className={className}
        placeholder={loading ? 'Loading sprints...' : placeholder}
        mode='multiple'
        maxTagCount='responsive'
        onChange={(values: number[]) => {
          // Filter out any non-numeric values before passing to the parent component
          const cleanValues = Array.isArray(values) ? 
            values.filter(v => typeof v === 'number') : 
            [];
          onChange(cleanValues);
        }}
        value={safeValue}
        style={style}
        status={status}
        loading={loading}
        disabled={loading}
      >
        {userGroups.map((group) => (
          <Select.Option className='undp-select-option' key={group.id} value={group.id}>
            {group.name}
          </Select.Option>
        ))}
      </Select>
      {helpText && (
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          {helpText}
        </p>
      )}
      {error && (
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font' style={{ color: 'var(--dark-red)' }}>
          {error}
        </p>
      )}
    </>
  );
}