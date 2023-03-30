import BoxBetween from '@/components/mui/BoxBetween';
import BoxCenter from '@/components/mui/BoxCenter';
import store from '@/reducers';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_NAME_PATTERNS,
  NAME_PATTERN_ORDER,
  NAME_TABLE_COLUMNS,
} from '../constants';

export default function TabNaming({ images }) {
  // Names & Files Tab
  const exampleBox = useRef(null);

  const [contents, setContents] = useState([]);
  const [searchrows, setSearchRows] = useState([]); // Search Bar
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectionRange, setSelectionRange] = useState(null);
  const [namePatterns, setNamePatterns] = useState(DEFAULT_NAME_PATTERNS);

  useEffect(() => {
    setContents([]);
    setSearchRows([]);
    for (let i = 0; i < images.length; i++) {
      if (images[i]) {
        let current_file = {
          id: (i + 1).toString(),
          filename: images[i].filename.replace(/\s+/g, ''),
          series: '',
          row: '',
          col: '',
          field: '',
          channel: '',
          z: '',
          time: '',
          hole: -1,
        };
        setContents((contents) => [...contents, current_file]);
        setSearchRows((rows) => [...rows, current_file]);
      }
    }
    if (images.length > 0) {
      setSelectedFileName(images[0].filename.split('.')[0].replace(/\s+/g, ''));
    }
  }, [images]);

  // Select update each fields -> namepattern
  const selectExampleString = () => {
    if (typeof window.getSelection !== 'undefined') {
      try {
        let sel = window.getSelection(),
          range = sel.getRangeAt(0);
        let selectionRect = range.getBoundingClientRect(),
          fullRect = exampleBox.current.getBoundingClientRect();
        let startOffset =
          ((selectionRect.left - fullRect.left) / selectionRect.width) *
          range.toString().length;
        startOffset = Math.round(startOffset);
        let selectionRangeValue = {
          text: range.toString(),
          startOffset: startOffset,
          endOffset: startOffset + range.toString().length,
        };
        setSelectionRange(selectionRangeValue);
      } catch (error) {}
    }
  };

  const getSelectionText = () => {
    var text = '';
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== 'Control') {
      text = document.selection.createRange().text;
    }
    return text.replaceAll('\n', '');
  };

  const clickNamePattern = (index) => {
    let selectedText = getSelectionText();
    if (selectionRange !== null && selectedText !== '') {
      let text = selectionRange.text;
      let startOffset = selectionRange.startOffset;
      let endOffset = selectionRange.endOffset;
      if (text.replace(/\s+/g, '') === selectedText) {
        if (startOffset > -1 && endOffset > -1) {
          let namePatternsPrimaryValue = [...namePatterns];
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
          setNamePatterns(namePatternsPrimaryValue);
        }
      }
    }
  };

  const onChangePattern = async (e, index) => {
    let selectedText = '';
    let inputed_value = e.target.value.toString();
    for (let i = 0; i < inputed_value.length; i++) {
      if (inputed_value.substring(i, i + 1) !== ' ') {
        selectedText = selectedText + inputed_value.substring(i, i + 1);
      }
    }
    if (selectionRange !== null) {
      let text = selectionRange.text;
      let startOffset = selectionRange.startOffset;
      let endOffset = selectionRange.endOffset;
      if (text === selectedText) {
        if (startOffset > -1 && endOffset > -1) {
          let namePatternsPrimaryValue = [...namePatterns];
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
          setNamePatterns(namePatternsPrimaryValue);
        }
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
        for (let k = 0; k < namePatterns.length; k++) {
          if (namePatterns[k].field === key) {
            currentIndex = k;
            break;
          }
        }
        let tempString = objectPerFile.filename.substring(
          namePatterns[currentIndex].start,
          namePatterns[currentIndex].end,
        );
        if (key === 'id') {
          resultContent[`${key}`] = objectPerFile.id;
        } else if (key === 'series') {
          result[`${key}`] = tempString;
          resultContent[`${key}`] = tempString;
        } else if (key === 'filename') {
          result[`${key}`] = objectPerFile.filename;
          resultContent[`${key}`] = objectPerFile.filename;
        } else if (key === 'z') {
          if (tempString === 'z') {
            for (let j = 1; j < 4; j++) {
              tempString = objectPerFile.filename.substring(
                namePatterns[currentIndex].start + j,
                namePatterns[currentIndex].start + j + 1,
              );
              if (tempString === '_') {
                moveIndex = j + 1;
                tempString = objectPerFile.filename.substring(
                  namePatterns[currentIndex].start + 1,
                  namePatterns[currentIndex].start + j,
                );
                result[`${key}`] = parseInt(tempString) + 1;
                resultContent[`${key}`] = objectPerFile.filename.substring(
                  namePatterns[currentIndex].start,
                  namePatterns[currentIndex].start + j,
                );
              }
            }
          } else {
            result[`${key}`] = convertContentStringToInteger(key, tempString);
            resultContent[`${key}`] = tempString;
          }
        } else {
          tempString = objectPerFile.filename.substring(
            namePatterns[currentIndex].start + moveIndex,
            namePatterns[currentIndex].end + moveIndex,
          );
          result[`${key}`] = convertContentStringToInteger(key, tempString);
          resultContent[`${key}`] = tempString;
        }
      }
    }
    return [result, resultContent];
  };

  const updateNameType = () => {
    if (images === null || images === undefined) {
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
    let vessel = 'Wafer 150mm';
    if (maxcol === '01' && maxrow === 'A') {
      vessel = 'Slide Single';
    } else if (maxrow === 'A') {
      vessel = 'Slide Quattour';
    } else if (maxrow === 'B') {
      vessel = 'Well 4well';
    } else if (
      (maxrow.localeCompare('B') === 1 && maxrow.localeCompare('H') === -1) ||
      maxrow.localeCompare('H') === 0
    ) {
      vessel = 'Well 96well';
    }

    const metainfo = {
      vesselnum: 1,
      vessel: vessel,
      object: new_content[0].series,
      channel: channels,
      zposition: zposition,
      timeline: maxTimeLine,
    };
    store.dispatch({ type: 'setMetaInfo', content: metainfo });
    setSearchRows(JSON.parse(JSON.stringify(new_content)));
  };

  // clear button + change file name
  const reset_namePatterns = () => {
    let namePatternsPrimaryValue = [...namePatterns];
    for (let i = 0; i < namePatternsPrimaryValue.length; i++) {
      namePatternsPrimaryValue[i].text = '';
      namePatternsPrimaryValue[i].start = 0;
      namePatternsPrimaryValue[i].end = 0;
    }
    setNamePatterns(namePatternsPrimaryValue);
  };

  const clearNameType = () => {
    for (let k = 0; k < selectedFileName.length; k++) {
      document.getElementById('filename' + k.toString()).style.color = '#000';
    }
    reset_namePatterns();
  };

  const updateNativeSelect = (event) => {
    setSelectedFileName(event.target.value.toString().split('.')[0]);
    reset_namePatterns();
  };

  return (
    <Box>
      <BoxCenter px={2} py={1}>
        <Typography mr={1}>Example:</Typography>
        <div
          className="showFileName shadow-none mb-0 pb-0 d-flex"
          ref={exampleBox}
          onMouseUp={() => selectExampleString()}
          style={{ height: 'auto !important' }}
        >
          {selectedFileName.split('').map((item, index) => {
            return (
              <tt key={index}>
                <strong>
                  <p
                    id={'filename' + index.toString()}
                    className="mb-0 font-bolder font-20"
                    key={index}
                  >
                    {item}
                  </p>
                </strong>
              </tt>
            );
          })}
        </div>
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
        {namePatterns.map((pattern, idx) => {
          return (
            <div key={idx} className="pattern-section border">
              <Button
                size="small"
                className="pattern-item-button"
                variant="contained"
                onClick={() => {
                  clickNamePattern(idx);
                }}
                sx={{
                  bgcolor: pattern.color,
                }}
              >
                {pattern.label}
              </Button>
              <TextField
                id={pattern.label}
                value={pattern.text}
                onChange={(e) => onChangePattern(e, idx)}
                size="small"
                variant="standard"
                sx={{ textAlign: 'center' }}
              />
            </div>
          );
        })}
      </BoxBetween>
      <Box sx={{ height: 300 }}>
        <DataGrid rows={searchrows} columns={NAME_TABLE_COLUMNS} />
      </Box>
    </Box>
  );
}
