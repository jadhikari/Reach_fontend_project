import React, { useState, useEffect } from 'react';
import { RxUpdate } from 'react-icons/rx';
import { useCurtailmentAddData, useCurtailmentUpdateData } from './../../hooks';
import 'bootstrap/dist/css/bootstrap.min.css';

export const CurtailmentTable = ({ data, apiEndPoint, selectedPlant }) => {
  const [lastMonthDates, setLastMonthDates] = useState([]);
  const { addCurtailmentData } = useCurtailmentAddData();
  const { updateCurtailmentData } = useCurtailmentUpdateData();
  const [editMode, setEditMode] = useState({});
  const [error, setError] = useState({});
  const [isAdded, setIsAdded] = useState({}); // Track whether each date is added

  // Function to get all dates for the last month
  const getLastMonthDates = () => {
    const today = new Date();
    const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    const lastMonthYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    const lastDayLastMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate();
    const dates = [];

    for (let i = 1; i <= lastDayLastMonth; i++) {
      const date = new Date(lastMonthYear, lastMonth, i);
      const formattedDate = date.toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
      dates.push(formattedDate);
    }

    setLastMonthDates(dates);
  };

  useEffect(() => {
    getLastMonthDates();
  }, []);

  // Function to get start time, end time, and id for a given date from the data
  const getStartEndTimeForDate = (date) => {
    const record = data.find(item => item.date === date);
    if (record) {
      return { start_time: record.start_time, end_time: record.end_time, id: record.id };
    }
    return { start_time: '', end_time: '', id: null };
  };

  // Function to handle adding or updating time for a specific date
  const handleSave = async (date, isUpdate = false, id = null) => {
    const start_time = document.querySelector(`input[name="start_time_${date}"]`)?.value || '';
    const end_time = document.querySelector(`input[name="end_time_${date}"]`)?.value || '';

    if (!start_time || !end_time) {
      setError((prevError) => ({
        ...prevError,
        [date]: 'Both start and end times are required.'
      }));
      console.warn(`Both start and end times are required for ${date}.`);
      return;
    } else {
      setError((prevError) => ({ ...prevError, [date]: '' })); // Clear error
    }

    try {
      if (isUpdate) {
        if (editMode[date]) {
          await updateCurtailmentData({ id, date, start_time, end_time, apiEndPoint, selectedPlant });
          //console.log(`Updated for ${date}: ID - ${id}, Start Time - ${start_time}, End Time - ${end_time}`);
          setEditMode((prevState) => ({ ...prevState, [date]: false }));
        } else {
          setEditMode((prevState) => ({ ...prevState, [date]: true }));
        }
      } else {
        const response = await addCurtailmentData({ date, start_time, end_time, apiEndPoint, selectedPlant });
        if (response.success) {
          //console.log(`Successfully added for ${date}: Start Time - ${start_time}, End Time - ${end_time}`);
          // Update isAdded state to mark this date as added
          setIsAdded((prevIsAdded) => ({ ...prevIsAdded, [date]: true }));
        }
      }
    } catch (error) {
      console.error(`Error adding/updating curtailment data for ${date}:`, error.message);
      setError((prevError) => ({ ...prevError, [date]: error.message }));
    }
  };

  return (
    <div className="shadow-sm p-3 bg-white rounded" style={{ width: '50%',marginLeft:'25%' }}>
      <h6>Curtailment event entry for {selectedPlant}</h6>
      <table className="table table-sm table-bordered table-hover mt-3">
        <thead className="thead-light text-center" >
          <tr >
            <th style={{ backgroundColor: '#afd1f3' }}>Date</th>
            <th style={{ backgroundColor: '#afd1f3' }}>Start Time</th>
            <th style={{ backgroundColor: '#afd1f3' }}>End Time</th>
            <th style={{ backgroundColor: '#afd1f3' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {lastMonthDates.map((date) => {
            const { start_time, end_time, id } = getStartEndTimeForDate(date);
            const isUpdate = isAdded[date] || (start_time && end_time);

            return (
              <tr key={date}>
                <td className='text-center align-middle' style={{ backgroundColor: '#afd1f3' }}>
                  <b>{date}</b>
                </td>
                <td>
                  <input
                    type="time"
                    name={`start_time_${date}`}
                    defaultValue={start_time || ''}
                    className="form-control"
                    disabled={!editMode[date] && isUpdate}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    name={`end_time_${date}`}
                    defaultValue={end_time || ''}
                    className="form-control"
                    disabled={!editMode[date] && isUpdate}
                  />
                </td>
                <td className='text-center align-middle'>
                  <button
                    onClick={() => handleSave(date, isUpdate, id)}
                    className={`btn  ${isUpdate ? 'btn btn-sm btn-warning' : 'btn btn-sm btn-primary'}`}
                  >
                    {isUpdate && editMode[date] ? <RxUpdate /> : isUpdate ? 'Update' : 'Add'}
                  </button><br />
                  {error[date] && (
                    <span className="text-danger" style={{ fontSize: '0.9em' }}>
                      {error[date]}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
