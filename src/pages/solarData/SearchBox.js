import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt } from 'react-icons/fa';

export const SearchBox = ({ loggerNames, loggerPlantsGroup, onSearch, searchParams = {} }) => {
  //console.log(loggerPlantsGroup); // Logger group info
  const { formattedDate = '', selectedLoggers = [], selectedGroup = null } = searchParams;

  const [date, setDate] = useState(formattedDate ? new Date(`${formattedDate}-01`) : null);
  const [loggers, setLoggers] = useState(selectedLoggers.map(logger => ({ value: logger, label: logger })));
  const [group, setGroup] = useState(selectedGroup ? { value: selectedGroup, label: selectedGroup } : null);

  useEffect(() => {
    setDate(formattedDate ? new Date(`${formattedDate}-01`) : null);
    setLoggers(selectedLoggers.map(logger => ({ value: logger, label: logger })));
    setGroup(selectedGroup ? { value: selectedGroup, label: selectedGroup } : null);
  }, [formattedDate, selectedLoggers, selectedGroup]);

  const loggerOptions = loggerNames.map(logger => ({
    value: logger,
    label: logger,
  }));

  const groupOptions = loggerPlantsGroup.map(group => ({
    value: group.group_name,
    label: group.group_name,
  }));

  const handleDateChange = (date) => {
    const formattedValue = date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}` : '';
    setDate(date);
    onSearch({ formattedDate: formattedValue, selectedLoggers: loggers.map(logger => logger.value), selectedGroup: group ? group.value : null });
  };

  const handleLoggerChange = (selectedOptions) => {
    if (group) {
      alert('Please deselect the group before selecting loggers.');
      return;
    }
    const selectedLoggerValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setLoggers(selectedOptions || []);
    onSearch({ formattedDate: date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}` : '', selectedLoggers: selectedLoggerValues, selectedGroup: group ? group.value : null });
  };

  const handleGroupChange = (selectedOption) => {
    if (loggers.length > 0) {
      alert('Please deselect the loggers before selecting a group.');
      return;
    }
    setGroup(selectedOption);
    onSearch({ formattedDate: date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}` : '', selectedLoggers: loggers.map(logger => logger.value), selectedGroup: selectedOption ? selectedOption.value : null });
  };

  return (
    <div className="mb-4" style={{ width: '99%'}}>
      <div className="row shadow border pb-3 rounded " style={{  height: '100%'}}>
        <Form className="d-flex flex-column flex-md-row justify-content-between align-items-center" style={{  marginTop: '16px'}} >
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
                {/* No clear button here */}
              </div>
            </Form.Group>
          </div>

          {/* Separator */}
          <div className="col-12 col-md-1 text-center mb-2 mb-md-0">
            <span><b>or</b></span>
          </div>

          {/* Multi Logger Select Section */}
          <div className="col-12 col-md-5">
            <Form.Group controlId="formLoggerMulti">
              <div className="input-group">
                <Select
                  isMulti
                  value={loggers}
                  onChange={handleLoggerChange}
                  options={loggerOptions}
                  placeholder="Select Logger(s)"
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
