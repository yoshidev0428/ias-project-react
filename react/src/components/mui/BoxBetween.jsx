import { Box } from '@mui/material';

export default function BoxBetween({ children, ...others }) {
  return (
    <Box
      {...others}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      {children}
    </Box>
  );
}
