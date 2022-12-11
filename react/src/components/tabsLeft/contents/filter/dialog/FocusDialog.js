import * as React from 'react'
import Button from '@mui/material/Button'

import {useFlagsStore} from "../../../../state"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import Dialog from "@mui/material/Dialog"
import Draggable from 'react-draggable'
import Paper from "@mui/material/Paper"

const FocusDialog = () => {
  const Focusflag = useFlagsStore(store => store.Focusflag)
  const close = () => {
    useFlagsStore.setState({ Focusflag: false })
  }

  function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
          <Paper {...props} />
        </Draggable>
    );
  }

  return (
    <>
      <Dialog open={Focusflag} onClose={close} maxWidth={"350"} PaperComponent={PaperComponent} hideBackdrop={true} onBackdropClick="false"
              disableScrollLock aria-labelledby="draggable-dialog-title" >
        <div className="d-flex border-bottom">
          <DialogTitle>Focus Stack</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>&times;</button>
        </div>
        <div className='mt-2'>
          <DialogActions>
            <Button className="" variant="contained" color="success" size="medium" onClick={close}>Cancel</Button>
            <Button className="" variant="contained" color="primary" size="medium" onClick={close}>Set</Button>
            <Button className="" variant="contained" color="primary" size="medium" onClick={close}>Set All</Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  )
}
export default FocusDialog