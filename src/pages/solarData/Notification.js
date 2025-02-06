import React, { useState } from 'react';
import styles from './TableStyles.module.css'; 


export const Notification = ({ missingLoggers, yearMonthDate, zeroPowerGen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (missingLoggers.length === 0 && zeroPowerGen.length === 0 ) {
    return (
      <div className="alert alert-success mb-4">
        All loggers' data are accounted for on {yearMonthDate}.
      </div>
    );
  }


  return (
    <div className="alert alert-danger mb-4" style={{ width: '98%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', height:'10px' }}>
        <span>
          For {yearMonthDate}, {missingLoggers.length} loggers' data are missing and {zeroPowerGen.length} logger have Zero(0) power production.
        </span>
        <button
          onClick={toggleExpand}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: 'inherit',
          }}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.Ncontainer}>
          <p className={`${styles.boldText} ${styles.textsize}`}>Missing Data: </p>
          {missingLoggers.map((loggerName, index) => (
            <div key={index} className={styles.loggerName}>
              <p className={styles.textsize}>{loggerName}, </p>
            </div>
          ))}
          <p className={`${styles.boldText} ${styles.textsize}`}>Production Zero(0): </p>
          {zeroPowerGen.map((loggerName, index) => (
            <div key={index} className={styles.loggerName}>
              <p className={styles.textsize}>{loggerName}, </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
