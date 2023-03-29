import { Box } from '@mui/material';

export default function CenterBox({ children, ...others }) {
  return (
    <Box {...others} display="flex" justifyContent="center" alignItems="center">
      {children}
    </Box>
  );
}
