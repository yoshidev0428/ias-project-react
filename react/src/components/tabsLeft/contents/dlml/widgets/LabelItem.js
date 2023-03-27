import Icon from '@mdi/react';
import { mdiDeleteCircle, mdiRadioboxBlank, mdiCheckCircle } from '@mdi/js';

const LabelItem = (props) => {
  const { label, onDelete, onSelect, selectedLabel } = props;

  return (
    <div
      className="d-flex justify-content-around"
      style={{ fontSize: '0.8rem' }}
    >
      <label style={{ width: '40%' }} for="colorpicker">
        {`${label.name}`}{' '}
      </label>
      <input
        style={{ width: '20%' }}
        type="color"
        id="colorpicker"
        value={label.color}
      ></input>
      <Icon
        sx={{ width: '20%' }}
        path={mdiDeleteCircle}
        size={1}
        onClick={(label) => onDelete(label)}
      />
      <Icon
        sx={{ width: '20%' }}
        path={
          selectedLabel?.name === label.name ? mdiCheckCircle : mdiRadioboxBlank
        }
        size={1}
        onClick={(label) => onSelect(label)}
      />
    </div>
  );
};

export default LabelItem;
