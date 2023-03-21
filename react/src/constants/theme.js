import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    'card-title': {
      fontSize: '14px',
      fontWeight: 'bold',
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'icon' },
          style: {
            padding: 0,
            minWidth: 0,
            margin: 2,
            border: '1px solid gray',
          },
        },
      ],
    },
  },
});

export default theme;
