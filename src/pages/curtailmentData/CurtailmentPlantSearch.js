import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export const CurtailmentPlantSearch = ({ plantIds, onSearch }) => {
  // State to manage selected plant
  const [selectedPlant, setSelectedPlant] = useState(null);

  const plantOptions = plantIds.map((plantId) => ({
    value: plantId,
    label: plantId,
  }));

  const handlePlantChange = (selectedOption) => {
    const selectedPlantValue = selectedOption ? selectedOption.value : null;
    setSelectedPlant(selectedPlantValue); // Update selected plant ID
    onSearch({
      selectedPlant: selectedPlantValue,
    });
  };

  return (
    <div className="mb-4 ms-2" style={{ width: '98%' }}>
      <div className="row shadow border pb-3 rounded" style={{ height: '100%' }}>
        <Form className="d-flex flex-column flex-md-row align-items-center" style={{ marginTop: '16px' }}>
          {/* Label and dropdown in the same row */}
          <div className="col-12 d-flex align-items-center">
            <Form.Label className="me-3 h6" style={{ minWidth: '250px' }}>
              Select the Plant Id that you want to add the curtailment:
            </Form.Label>
            <Form.Group controlId="formPlantSingle" style={{ width: '20%' }}>
              <Select
                value={selectedPlant ? { value: selectedPlant, label: selectedPlant } : null}
                onChange={handlePlantChange}
                options={plantOptions}
                placeholder="Select Plant"
                className="w-100"
                classNamePrefix="select"
              />
            </Form.Group>
          </div>
        </Form>
      </div>
    </div>
  );
};
