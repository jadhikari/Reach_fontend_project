import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export const SearchBox = ({ loggerNames, onSearch, searchParams = {} }) => {
  const { formattedDate = '', selectedLoggers = [] } = searchParams;

  // Setting initial state values based on searchParams for date and logger
  const [date, setDate] = useState(formattedDate ? new Date(`${formattedDate}-01`) : null);
  const [loggers, setLoggers] = useState(
    selectedLoggers.length ? { value: selectedLoggers[0], label: selectedLoggers[0] } : null
  );

  useEffect(() => {
    setDate(formattedDate ? new Date(`${formattedDate}-01`) : null);
    setLoggers(
      selectedLoggers.length ? { value: selectedLoggers[0], label: selectedLoggers[0] } : null
    );
  }, [formattedDate, selectedLoggers]);

  const loggerOptions = loggerNames.map(logger => ({
    value: logger,
    label: logger,
  }));

  // Date change handler
  const handleDateChange = (date) => {
    const formattedValue = date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}` : '';
    setDate(date);
    onSearch({
      formattedDate: formattedValue,
      selectedLoggers: loggers ? [loggers.value] : [],
    });
  };

  // Single logger selection handler
  const handleLoggerChange = (selectedOption) => {
    setLoggers(selectedOption);
    onSearch({
      formattedDate: date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}` : '',
      selectedLoggers: selectedOption ? [selectedOption.value] : [],
    });
  };

  return (
    <div className="container">
      <div className="row shadow border pb-3 rounded">
        <Form className="d-flex flex-column flex-md-row">
          <div className="col-3">
            <Form.Group controlId="formDate">
              <div className="input-group">
                <DatePicker
                  selected={date}
                  onChange={handleDateChange}
                  className="form-control pe-5"
                  dateFormat="yyyy-MM"
                  showMonthYearPicker
                  placeholderText="Select year and month"
                />
              </div>
            </Form.Group>
          </div>

          <div className="col-9">
            <Form.Group controlId="formLogger" className="d-flex w-100">
              <Select
                value={loggers}
                onChange={handleLoggerChange}
                options={loggerOptions}
                placeholder="Select Logger"
                className="w-100"
                classNamePrefix="select"
              />
            </Form.Group>
          </div>
        </Form>
      </div>
      <br />
    </div>
  );
};
