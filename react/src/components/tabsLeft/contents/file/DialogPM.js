import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';


const DialogPM = () => {
  const [value, setValue] = React.useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const dialog = () => {
    console.log("disable dialog button clicked ok");
    setShowDialog(false);
  }

  return (
    <>
      <div className="text-center">
        <Dialog maxWidth='500' fullWidth={true} open={showDialog} >
          <DialogContent>
            <Card> 
              <CardHeader className="text-h5 grey lighten-2" title="Pattern Matching" />
              <CardContent>
                <FormControl >
                  <Select
                    value={value}
                    label="Correlation Method"
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    label="Overlap X"
                    inputProps={{
                      type: 'number',
                    }}
                  />
                  <TextField
                    size="small"
                    label="Overlap Y"
                    inputProps={{
                      type: 'number',
                    }}
                  />
                  <TextField
                    size="small"
                    label="Search Radius (%)"
                    inputProps={{
                      type: 'number',
                    }}
                  />
                  <TextField
                    size="small"
                    label="Matching Threshold (%)"
                    inputProps={{
                      type: 'number',
                    }}
                  />
                  <FormGroup>
                      <FormControlLabel control={<Checkbox />} label="Uniform X/Y Overlaps" />
                      <FormControlLabel control={<Checkbox />} label="Multi-point Registrasion" />
                  </FormGroup>
                </FormControl>
              </CardContent>
              <Divider/>
              <CardActions>
                <div className="spacer"></div>
                <Button onClick={dialog}>Ok</Button>
              </CardActions>
            </Card>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
DialogPM.propTypes = {
  handleClose: PropTypes.func.isRequired
};
export default DialogPM;