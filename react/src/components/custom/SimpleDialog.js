import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SimpleDialog = ({ title, children, onClose, ...other }) => {
  return (
    <Dialog open={true} onClose={onClose} {...other}>
      <DialogTitle sx={{ m: 0, px: 3, py: 2 }}>
        {title}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 3 }} dividers>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SimpleDialog;
