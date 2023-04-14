// import { formatDistanceToNow, subHours } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { connect, useSelector } from 'react-redux';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const CloudInfo = (props) => {
  const user = useSelector((state) => state.auth.user);
  const products = [
    {
      id: uuid(),
      name: 'Name ',
      imageUrl: 'public/icons/product_1.png',
      detail: user.fullName,
    },
    {
      id: uuid(),
      name: 'Email',
      imageUrl: '/public/icons/product_2.png',
      detail: user.email,
    },
    // {
    //   id: uuid(),
    //   name: 'license',
    //   imageUrl: '/public/icons/product_3.png',
    //   detail: "0887RJ988DSF978SHG8SJDS98F"
    // },
    // {
    //   id: uuid(),
    //   name: 'Left days',
    //   imageUrl: '/public/icons/product_4.png',
    //   detail: "33 days"
    // }
  ];
  return (
    <Card {...props}>
      <CardHeader
        subtitle={`${products.length} in total`}
        title="My Information"
      />
      <Divider />
      <List>
        {products.map((product, i) => (
          <ListItem divider={i < products.length - 1} key={product.id}>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText primary={product.name} secondary={product.detail} />
            <IconButton edge="end" size="small">
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

export default connect(mapStateToProps)(CloudInfo);
