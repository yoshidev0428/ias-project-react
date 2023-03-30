import { Box } from '@mui/material';

export default function BoxCenter({ children, ...others }) {
  return (
    <Box {...others} display="flex" justifyContent="center" alignItems="center">
      {children}
    </Box>
  );
}
