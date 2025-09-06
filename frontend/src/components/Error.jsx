import React from 'react'

const Error = (message) => {
  return (
    <div className="row mt-3">
        <div className="alert alert-danger col-6 offset-3" role="alert">
            <p className="alert-heading">message</p>
        </div>
    </div>
  )
}

export default Error