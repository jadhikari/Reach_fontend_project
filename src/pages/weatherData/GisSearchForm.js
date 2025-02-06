import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap'; // Added Button for the submit
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt } from 'react-icons/fa';

export const GisSearchForm = ({ onSearchSubmit, gisSystemList }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      setSelectedDate(formattedDate);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    if (!selectedDate || !selectedSystem) {
      setErrorMessage('Please select both a date and a system/group.');
    } else {
      setErrorMessage('');
      onSearchSubmit({
        selectedDate,
        selectedSystem,
      });
      // console.log('Form submitted with:', { selectedDate, selectedSystem });
    }
  };

  const gisOptions =
    gisSystemList && Array.isArray(gisSystemList.gisList)
      ? gisSystemList.gisList.map((item) => ({
          label: `${item.system_id} for ${item.group_name}`,
          value: item.id,
        }))
      : [];
  
  return (
    <div className="mb-4 ms-2" style={{ width: '99%' }}>
      <div className="row shadow border pb-3 rounded" style={{ height: '100%' }}>
        <Form
          className="d-flex flex-column flex-md-row justify-content-between align-items-center"
          style={{ marginTop: '16px' }}
          onSubmit={handleSubmit} // Attach handleSubmit to the form
        >
          {/* Date Picker Section */}
          <div className="col-12 col-md-6">
            <Form.Group controlId="formDate">
              <div className="input-group">
                <DatePicker
                  className="form-control"
                  dateFormat="yyyy-MM"
                  showMonthYearPicker
                  placeholderText="Select month and year"
                  selected={selectedDate ? new Date(`${selectedDate}-01`) : null}
                  onChange={handleDateChange}
                  maxDate={new Date()}
                />
                <span className="input-group-text">
                  <FaCalendarAlt />
                </span>
              </div>
            </Form.Group>
          </div>

          {/* System/Group Selection Dropdown */}
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <Form.Group controlId="formSystem">
              <div className="input-group">
                <Select
                  options={gisOptions}
                  placeholder="Select System/Group"
                  className="w-100"
                  classNamePrefix="select"
                  isClearable
                  noOptionsMessage={() => 'No systems/groups available'}
                  value={gisOptions.find((option) => option.value === selectedSystem) || null}
                  onChange={(selectedOption) =>
                    setSelectedSystem(selectedOption ? selectedOption.value : null)
                  }
                />
              </div>
            </Form.Group>
          </div>

          {/* Submit Button */}
          <div className="col-12 col-md-3 text-md-end mt-2 mt-md-0">
            <Button variant="primary" type="submit">
              Search
            </Button>
          </div>
        </Form>

        {/* Error Message */}
        {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
      </div>
    </div>
  );
};
