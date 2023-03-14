import * as React from 'react';
import loadingImg from '../../assets/images/loading.gif';

const LoadingDialog = () => {
  return (
    <div className="loading-dialog">
      <img className="loading-img" src={loadingImg} />
    </div>
  );
};

export default LoadingDialog;
