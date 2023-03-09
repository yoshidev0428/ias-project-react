import React from 'react';
import Icon from '@mdi/react';
import { Image } from 'react-bootstrap';
import { COLORS } from '@/constants';

const CustomButton = (props) => {
  return (
    <div
      className="custom-button"
      onClick={props.click}
      style={{
        height: props.label ? '36px' : '22px',
        color: `${COLORS.LIGHT_CYAN}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minWidth: '25px',
      }}
    >
      {props.image && (
        <div
          className="d-flex m-auto"
          style={{ height: props.label ? '50%' : '100%' }}
        >
          <Image
            style={{ margin: '0 auto', width: '100%', height: '100%' }}
            src={require('../../assets/images/' + props.image + '.png')}
            alt="no image"
          />
        </div>
      )}
      {props.icon && (
        <div className="d-flex m-auto" style={{ justifyContent: 'center' }}>
          <Icon path={props.icon} size={0.8} color={COLORS.LIGHT_CYAN} />
        </div>
      )}
      <div
        className="label-text text-center"
        style={{ height: props.label ? '50%' : '0' }}
      >
        {props.label}
      </div>
    </div>
  );
};

export default CustomButton;
