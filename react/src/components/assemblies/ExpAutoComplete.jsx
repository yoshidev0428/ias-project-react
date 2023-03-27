import AutoComplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const filter = createFilterOptions();

export default function ExpAutoComplete({
  value,
  onChange,
  options,
  ...others
}) {
  return (
    <AutoComplete
      value={value}
      fullWidth
      onChange={(_event, newValue) => {
        if (typeof newValue === 'string') {
          onChange(
            options.find((exp) => exp.experiment_name === newValue) ?? {
              experiment_name: newValue,
            },
          );
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          onChange(
            {
              experiment_name: newValue.inputValue,
            },
            true,
          );
        } else {
          onChange(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.experiment_name,
        );
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            experiment_name: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.experiment_name;
      }}
      renderOption={(props, option) => (
        <li {...props}>{option.experiment_name}</li>
      )}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Select experiment" size="small" />
      )}
      {...others}
    />
  );
}
