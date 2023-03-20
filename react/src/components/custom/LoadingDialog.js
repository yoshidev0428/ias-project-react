import * as React from 'react';
import Loader from '@/components/avivator/Loader';
import loadingImg from '../../assets/images/loading.gif';

const LoadingDialog = () => {
  return (
    <div className="loading-dialog">
      <Loader />
    </div>
  );
};

export default LoadingDialog;
