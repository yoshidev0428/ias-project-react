import { Box } from '@mui/material';

export default function BoxAround({ children, ...others }) {
  return (
    <Box
      {...others}
      display="flex"
      justifyContent="space-around"
      alignItems="center"
    >
      {children}
    </Box>
  );
}
