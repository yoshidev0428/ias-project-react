const LabelColorItem = (props) => {
  const { label, onColorChange } = props;

  return (
    <div
      className="d-flex justify-content-around"
      style={{ fontSize: '0.8rem' }}
    >
      <label for="colorpicker">{`${label.name}`} </label>
      <input
        style={{ margin: '0px 10px' }}
        type="color"
        id="colorpicker"
        value={label.color}
        onChange={(e) => onColorChange(e.target.value)}
      ></input>
    </div>
  );
};
export default LabelColorItem;
