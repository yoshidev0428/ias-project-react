import BoxBetween from '@/components/mui/BoxBetween';
import BoxCenter from '@/components/mui/BoxCenter';
import {
  Box,
  Button,
  DialogActions,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_NAME_PATTERNS,
  NAME_PATTERN_ORDER,
  NAME_TABLE_COLUMNS,
} from './constants';
import useTilingStore from '@/stores/useTilingStore';
import DialogContent from '@/components/mui/DialogContent';
import DataTable from '@/components/mui/DataTable';

export default function TabNaming() {
  const { tiles } = useTilingStore();
  const exampleBox = useRef(null);

  const [contents, setContents] = useState([]);
  const [searchrows, setSearchRows] = useState([]); // Search Bar
  const [selectedFileName, setSelectedFileName] = useState('');
  const [namePattern, setNamePattern] = useState(DEFAULT_NAME_PATTERNS);

  useEffect(() => {
    const contents = tiles.map((tile, idx) => ({
      ...tile,
      id: idx + 1,
    }));
    setContents(contents);
    setSearchRows(contents);
    if (tiles.length > 0) {
      setSelectedFileName(tiles[0].filename.split('.')[0]);
    }
  }, [tiles]);

  const clickNamePattern = (index) => {
    const selection = window.getSelection();

    if (selection) {
      const text = selection.toString();
      const startOffset = selection.anchorOffset;
      const endOffset = selection.extentOffset;
      if (startOffset > -1 && endOffset > -1) {
        let namePatternsPrimaryValue = [...namePattern];
        for (var i = 0; i < namePatternsPrimaryValue.length; i++) {
          if (index === i) {
            namePatternsPrimaryValue[index].text = text;
            namePatternsPrimaryValue[index].start = startOffset;
            namePatternsPrimaryValue[index].end = endOffset;
            for (let j = startOffset; j < endOffset; j++) {
              document.getElementById('filename' + j.toString()).style.color =
                namePatternsPrimaryValue[index].color;
            }
          }
        }
        setNamePattern(namePatternsPrimaryValue);
      }
    }
  };

  // ----------------------------------------------------- update button function
  // Convert string to integer of some fields: row, col, field, channel, z, time
  const convertContentStringToInteger = (field, stringData, _moveIndex) => {
    let newField = '';
    let intField = -5;
    if (field === 'row') {
      intField = stringData.charCodeAt(0) - 65;
    } else {
      newField = stringData.replace(/\D/g, '');
      intField = parseInt(newField);
    }
    return intField;
  };

  const getNamePatternPerFileForProcessing = (objectPerFile) => {
    let result = {};
    let resultContent = {};
    let moveIndex = 0;
    result[`dimensionChanged`] = false;
    for (let i = 0; i < NAME_PATTERN_ORDER.length; i++) {
      let key = NAME_PATTERN_ORDER[i];
      if (key && objectPerFile !== null) {
        let currentIndex = 0;
        for (let k = 0; k < namePattern.length; k++) {
          if (namePattern[k].field === key) {
            currentIndex = k;
            break;
          }
        }
        let tempString = objectPerFile.filename.slice(
          namePattern[currentIndex].start,
          namePattern[currentIndex].end,
        );
        if (key === 'id') {
          resultContent[key] = objectPerFile.id;
        } else if (key === 'series') {
          const matches = tempString.match(/\d+/);
          if (matches) {
            result[key] = Number(matches[0]);
            resultContent[key] = Number(matches[0]);
          }
        } else if (key === 'filename') {
          result[key] = objectPerFile.filename;
          resultContent[key] = objectPerFile.filename;
        } else if (key === 'z') {
          if (tempString === 'z') {
            for (let j = 1; j < 4; j++) {
              tempString = objectPerFile.filename.substring(
                namePattern[currentIndex].start + j,
                namePattern[currentIndex].start + j + 1,
              );
              if (tempString === '_') {
                moveIndex = j + 1;
                tempString = objectPerFile.filename.substring(
                  namePattern[currentIndex].start + 1,
                  namePattern[currentIndex].start + j,
                );
                result[key] = parseInt(tempString) + 1;
                resultContent[key] = objectPerFile.filename.substring(
                  namePattern[currentIndex].start,
                  namePattern[currentIndex].start + j,
                );
              }
            }
          } else {
            result[key] = convertContentStringToInteger(key, tempString);
            resultContent[key] = tempString;
          }
        } else {
          tempString = objectPerFile.filename.substring(
            namePattern[currentIndex].start + moveIndex,
            namePattern[currentIndex].end + moveIndex,
          );
          result[key] = convertContentStringToInteger(key, tempString);
          resultContent[key] = tempString;
        }
      }
    }
    return [result, resultContent];
  };

  const updateNameType = () => {
    if (tiles === null || tiles === undefined) {
      return '';
    }
    let new_content = [];
    let new_content_processing = [];
    let old_content = [...contents];
    let old_content_p = JSON.parse(JSON.stringify(old_content));
    let channels = [];
    let maxcol = '01',
      maxrow = 'A',
      zposition = 0,
      maxTimeLine = 'p00';
    for (let i = 0; i < old_content.length; i++) {
      let result = getNamePatternPerFileForProcessing(old_content_p[i]);
      new_content.push(result[1]);
      new_content_processing.push(result[0]);
      if (channels.length === 0) {
        channels.push(result[1].channel);
      } else {
        if (
          channels.findIndex((channel) => channel === result[1].channel) === -1
        ) {
          channels.push(result[1].channel);
        }
      }

      if (maxTimeLine.localeCompare(result[1].time) === 1)
        maxTimeLine = result[1].time;
      if (maxcol.localeCompare(result[1].col) === -1) maxcol = result[1].col;
      if (maxrow.localeCompare(result[1].row) === -1) maxrow = result[1].row;
      if (zposition < result[1].z) zposition = result[1].z;
    }
    setSearchRows(new_content);
  };

  // clear button + change file name
  const resetNamePattern = () => {
    let namePatternsPrimaryValue = [...namePattern];
    for (let i = 0; i < namePatternsPrimaryValue.length; i++) {
      namePatternsPrimaryValue[i].text = '';
      namePatternsPrimaryValue[i].start = 0;
      namePatternsPrimaryValue[i].end = 0;
    }
    setNamePattern(namePatternsPrimaryValue);
  };

  const clearNameType = () => {
    for (let k = 0; k < selectedFileName.length; k++) {
      document.getElementById('filename' + k.toString()).style.color = '#000';
    }
    resetNamePattern();
  };

  const updateNativeSelect = (event) => {
    setSelectedFileName(event.target.value.toString().split('.')[0]);
    resetNamePattern();
  };

  return (
    <>
      <DialogContent dividers>
        <BoxCenter px={2} py={1}>
          <Typography mr={1}>Example:</Typography>
          <Box
            ref={exampleBox}
            sx={{ height: 30, position: 'relative', width: '100%' }}
          >
            <Box
              sx={{ top: 0, left: 0, position: 'absolute', display: 'flex' }}
            >
              {selectedFileName.split('').map((item, index) => (
                <strong key={index}>
                  <span
                    id={'filename' + index.toString()}
                    className="mb-0 font-bolder font-20"
                    style={{ userSelect: 'none', fontFamily: 'monospace' }}
                  >
                    {item === ' ' ? <>&nbsp;</> : item}
                  </span>
                </strong>
              ))}
            </Box>
            <Box
              sx={{
                top: 0,
                left: 0,
                position: 'absolute',
                color: 'transparent',
                fontFamily: 'monospace',
              }}
              className="mb-0 font-bolder font-20"
            >
              {selectedFileName}
            </Box>
          </Box>
          <select
            className="border-none ml-1 mb-0 showOnlyDropDownBtn"
            value={selectedFileName}
            onChange={(event) => updateNativeSelect(event)}
            style={{ border: 'none' }}
          >
            {contents.map((c, index) => {
              return (
                <option key={index} value={c.filename}>
                  {c.filename}
                </option>
              );
            })}
          </select>
        </BoxCenter>
        <BoxBetween mb={1}>
          {namePattern.map((pattern, idx) => {
            return (
              <div key={idx} className="pattern-section border">
                <Button
                  size="small"
                  className="pattern-item-button"
                  variant="contained"
                  onClick={() => clickNamePattern(idx)}
                  sx={{
                    bgcolor: pattern.color,
                  }}
                >
                  {pattern.label}
                </Button>
                <TextField
                  id={pattern.label}
                  value={pattern.text}
                  size="small"
                  variant="standard"
                  inputProps={{ sx: { textAlign: 'center' } }}
                />
              </div>
            );
          })}
        </BoxBetween>
        <DataTable rows={searchrows} columns={NAME_TABLE_COLUMNS} />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="primary" onClick={updateNameType}>
          Update
        </Button>
        <Button variant="outlined" color="error" onClick={clearNameType}>
          Reset
        </Button>
        <Button variant="outlined" color="warning">
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
