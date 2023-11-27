import React from 'react'

const HistoryRow = ({historyHeight, historyWeight, historyBmi, historyDate}) => {
  return (
        <div className="history-row">
          <div className="history-height">{historyHeight}</div>
          <div className="history-weight">{historyWeight}</div>
          <div className="history-bmi">{historyBmi}</div>
          <div className="history-date">{historyDate}</div>
        </div>
  )
}

export default HistoryRow