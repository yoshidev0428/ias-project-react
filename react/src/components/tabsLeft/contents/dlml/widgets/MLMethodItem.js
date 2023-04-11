import Icon from '@mdi/react';
import { mdiDeleteCircle, mdiRadioboxBlank, mdiCheckCircle } from '@mdi/js';
import Avatar from '@mui/material/Avatar';

const MLMethodItem = (props) => {
  const { method, onDelete, onSelect, selectedMethod } = props;

  return (
    <div
      className="d-flex flex-row justify-content-around"
      style={{ fontSize: '1.2rem', width: '400px', alignItems: 'center' }}
    >
      <div style={{ width: '20%' }}>
        <Avatar
          sx={{
            bgcolor: method.params.bgLabelColor,
            color: method.params.objectLabelColor,
            fontSize: '1rem',
            width: '2rem',
            height: '2rem',
          }}
        >
          {`${method.type.toUpperCase()}`}
        </Avatar>
      </div>
      <label
        style={{
          width: '50%',
          fontSize: '1rem',
          fontFamily: 'monospace',
          margin: 0,
        }}
        for="colorpicker"
      >
        {''}
        {`Method Name: ${method.name.toUpperCase()}`}{' '}
      </label>
      <Icon
        sx={{ width: '15%' }}
        path={
          selectedMethod?.name === method.name
            ? mdiCheckCircle
            : mdiRadioboxBlank
        }
        size={1}
        onClick={(method) => onSelect(method)}
      />
      <Icon
        sx={{ width: '15%' }}
        path={mdiDeleteCircle}
        size={1}
        onClick={(method) => onDelete(method)}
      />
    </div>
  );
};

export default MLMethodItem;
