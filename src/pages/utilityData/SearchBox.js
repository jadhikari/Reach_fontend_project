import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt } from 'react-icons/fa';

export const SearchBox = ({ plantIds, groupNames, onSearch, searchParams = {} }) => {
  const { formattedDate = '', selectedPlants = [], selectedGroup = null } = searchParams;

  // State to manage form inputs
  const [date, setDate] = useState(formattedDate ? new Date(`${formattedDate}-01`) : null);
  const [plants, setPlants] = useState(selectedPlants.map(plant => ({ value: plant, label: plant })));
  const [group, setGroup] = useState(selectedGroup ? { value: selectedGroup, label: selectedGroup } : null);

  const plantOptions = plantIds.map((plantId) => ({
    value: plantId,
    label: plantId,
  }));

  const groupOptions = groupNames.map((groupName) => ({
    value: groupName,
    label: groupName,
  }));

  const handleDateChange = (date) => {
    const formattedValue = date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}` : '';
    setDate(date);
    onSearch({
      formattedDate: formattedValue,
      selectedPlants: plants.map(plant => plant.value),
      selectedGroup: group ? group.value : '', // Empty string if no group is selected
    });
  };

  const handlePlantChange = (selectedOptions) => {
    // Alert if a group is already selected
    if (group) {
      alert('Please deselect the group before selecting plants.');
      return;
    }
    const selectedPlantValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setPlants(selectedOptions || []);
    onSearch({
      formattedDate: date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}` : '',
      selectedPlants: selectedPlantValues,
      selectedGroup: '', // Reset group selection
    });
  };

  const handleGroupChange = (selectedOption) => {
    // Alert if plants are already selected
    if (plants.length > 0) {
      alert('Please deselect the plants before selecting a group.');
      return;
    }
    setGroup(selectedOption);
    onSearch({
      formattedDate: date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}` : '',
      selectedPlants: plants.map(plant => plant.value), // Maintain current plant selections
      selectedGroup: selectedOption ? selectedOption.value : '', // Empty string if no group is selected
    });
  };

  return (
    <div className="mb-4 ms-2" style={{ width: '99%' }}>
      <div className="row shadow border pb-3 rounded" style={{ height: '100%' }}>
        <Form className="d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ marginTop: '16px' }}>
          {/* Date Picker Section */}
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <Form.Group controlId="formDate">
              <div className="input-group">
                <DatePicker
                  selected={date}
                  onChange={handleDateChange}
                  className="form-control"
                  dateFormat="yyyy-MM"
                  showMonthYearPicker
                  placeholderText="Select month and year"
                />
                <span className="input-group-text">
                  <FaCalendarAlt />
                </span>
              </div>
            </Form.Group>
          </div>

          {/* Single Group Select Section */}
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <Form.Group controlId="formGroup">
              <div className="input-group">
                <Select
                  value={group}
                  onChange={handleGroupChange}
                  options={groupOptions}
                  placeholder="Select Group"
                  className="w-100"
                  classNamePrefix="select"
                  isClearable
                />
              </div>
            </Form.Group>
          </div>

          {/* Separator */}
          <div className="col-12 col-md-1 text-center mb-2 mb-md-0">
            <span><b>or</b></span>
          </div>

          {/* Multi Plant Select Section */}
          <div className="col-12 col-md-5">
            <Form.Group controlId="formPlantMulti">
              <div className="input-group">
                <Select
                  isMulti
                  value={plants}
                  onChange={handlePlantChange}
                  options={plantOptions}
                  placeholder="Select Plant(s)"
                  className="w-100"
                  classNamePrefix="select"
                />
              </div>
            </Form.Group>
          </div>
        </Form>
      </div>
    </div>
  );
};
