import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiPlusCircle } from '@mdi/js';

const defaultLabel = {
  name: '',
  color: '#FF0000',
};

const LabelItemInput = (props) => {
  const { onAdd } = props;
  const [label, setLabel] = useState(defaultLabel);
  const addLabel = () => {
    onAdd(label);
    setLabel(defaultLabel);
  };

  const handleLabelName = (e) => {
    setLabel({
      ...label,
      name: e.target.value,
    });
  };

  const handleLabelColor = (e) => {
    setLabel({
      ...label,
      color: e.target.value,
    });
  };

  return (
    <div
      className="d-flex justify-content-around"
      style={{ display: 'flex', fontSize: '0.8rem' }}
    >
      <input
        style={{ width: '50%' }}
        type="text"
        value={label.name}
        placeholder={'input label'}
        onChange={handleLabelName}
      />
      <input
        style={{ width: '25%' }}
        type="color"
        id="colorpicker"
        value={label.color}
        onChange={handleLabelColor}
      ></input>
      <Icon
        sx={{ width: '25%' }}
        path={mdiPlusCircle}
        size={1}
        onClick={() => addLabel()}
      />
    </div>
  );
};

export default LabelItemInput;
