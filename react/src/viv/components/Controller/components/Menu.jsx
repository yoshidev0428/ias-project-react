import React, { useState, useReducer, useRef, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InfoIcon from '@mui/icons-material/Info';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import { makeStyles } from '@mui/material/styles';
import shallow from 'zustand/shallow';
import { Select } from '@mui/material';

import MenuTitle from './MenuTitle';
import DropzoneButton from './DropzoneButton';
import { isMobileOrTablet, getNameFromUrl } from '../../../utils';
import { useChannelsStore, useViewerStore } from '../../../state';

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: (props) => `${props.maxHeight - theme.spacing(4)}px`,
    // width: '365px',
    overflowX: 'hidden',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
      background: 'transparent',
    },
    scrollbarWidth: 'none',
  },
  typography: {
    fontSize: '.8rem',
  },
  paper: {
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    // backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 2,
  },
  item: {
    width: '100%',
  },
  divider: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
}));

function Header(props) {
  const image = useChannelsStore((store) => store.image);
  const [source, metadata] = useViewerStore((store) => [
    store.source,
    store.metadata,
  ]);
  const handleSubmitNewUrl = (event, newUrl) => {
    event.preventDefault();
    const newSource = {
      urlOrFile: newUrl,
      // Use the trailing part of the URL (file name, presumably) as the description.
      description: getNameFromUrl(newUrl),
    };
    useViewerStore.setState({ source: newSource });
  };
  const onImageSelectionChange = (e) =>
    useChannelsStore.setState({
      image: e.target.value,
    });
  const url = typeof source.urlOrFile === 'string' ? source.urlOrFile : '';
  const [text, setText] = useState(url);
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);
  const classes = useStyles(props);

  useEffect(() => setText(url), [url]);

  return (
    <Grid container direction="column" spacing={0}>
      {/* <Grid item xs={12}>
        <MenuTitle />
      </Grid> */}
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={1}>
          <InfoIcon onClick={toggle} ref={anchorRef} />
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            style={{ width: '25%' }}
          >
            <Paper style={{ padding: 8 }}>
              <ClickAwayListener onClickAway={toggle}>
                <Typography className={classes.typography}>
                  Provide a URL to an OME-TIFF file or a Bio-Formats Zarr store
                  to view the image. View the{' '}
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="http://viv.gehlenborglab.org"
                  >
                    docs
                  </Link>{' '}
                  to learn more about the supported file formats.
                </Typography>
              </ClickAwayListener>
            </Paper>
          </Popper>
        </Grid>
        <Grid item xs={11}>
          <form
            onSubmit={(event) => {
              handleSubmitNewUrl(event, text);
            }}
          >
            <TextField
              id="ome-input"
              label="OME-TIFF/Bioformats-Zarr URL"
              variant="filled"
              size="small"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </form>
        </Grid>
      </Grid>
      {!isMobileOrTablet() && (
        <Grid item xs={12} style={{ paddingTop: 16 }}>
          <DropzoneButton />
        </Grid>
      )}
      {Array.isArray(metadata) && (
        <Grid item xs={12}>
          <Select native value={image} onChange={onImageSelectionChange}>
            {metadata.map((meta, i) => (
              <option key={meta.Name} value={i}>
                {meta.Name}
              </option>
            ))}
          </Select>
        </Grid>
      )}
      <Grid item xs={12} className={classes.divider}>
        <Divider />
      </Grid>
    </Grid>
  );
}

function Menu({ children, ...props }) {
  const classes = useStyles(props);
  const [isControllerOn, toggleIsControllerOn] = useViewerStore(
    (store) => [store.isControllerOn, store.toggleIsControllerOn],
    shallow,
  );
  return isControllerOn ? (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        {/* <Header /> */}
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {children.map((child, i) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Grid item key={i} className={classes.item}>
                {child}
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  ) : (
    <Box>
      <Button
        variant="outlined"
        color="default"
        size="small"
        endIcon={<SettingsIcon />}
        onClick={toggleIsControllerOn}
        aria-label="show-menu"
      >
        AVIVATOR
      </Button>
    </Box>
  );
}

export default Menu;
