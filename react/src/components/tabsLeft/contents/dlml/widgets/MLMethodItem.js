import Icon from '@mdi/react';
import { mdiDeleteCircle, mdiRadioboxBlank, mdiCheckCircle } from '@mdi/js';
import Avatar from '@mui/material/Avatar';

const MLMethodItem = (props) => {
  const { method, onDelete, onSelect, selectedMethod } = props;

  return (
    <div
      className="d-flex flex-row justify-content-around"
      style={{ fontSize: '1.2rem', width: '400px' }}
    >
      <div style={{ width: '20%' }}>
        <Avatar
          sx={{
            bgcolor: 'red',
            width: '1.6rem',
            height: '1.6rem',
            lineHeight: '2rem',
          }}
        >{`${method.type}`}</Avatar>
      </div>
      <label style={{ width: '40%' }} for="colorpicker">
        {' '}
        {`${method.name}`}{' '}
      </label>
      <Icon
        sx={{ width: '1.2rem' }}
        path={
          selectedMethod?.name === method.name
            ? mdiCheckCircle
            : mdiRadioboxBlank
        }
        size={1}
        onClick={(method) => onSelect(method)}
      />
      <Icon
        sx={{ width: '20%' }}
        path={mdiDeleteCircle}
        size={1}
        onClick={(method) => onDelete(method)}
      />
    </div>
  );
};

export default MLMethodItem;
