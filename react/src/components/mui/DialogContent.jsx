import CircularProgress from '@mui/material/CircularProgress';
import MuiDialogContent from '@mui/material/DialogContent';
import BoxCenter from './BoxCenter';

export default function DialogContent({ loading, children, ...props }) {
  return (
    <MuiDialogContent {...props}>
      {loading ? (
        <BoxCenter sx={{ height: 300 }}>
          <CircularProgress />
        </BoxCenter>
      ) : (
        children
      )}
    </MuiDialogContent>
  );
}
