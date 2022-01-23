import React from 'react';
import { ACTIONS } from './App'

function OperatorButton({ operator, dispatch }) {
  return (
    <>
      <button
        onClick={() => dispatch({ type: ACTIONS.OPERATOR, payload: { operator } })}>
        {operator}
      </button>
    </>
  )
}

export default OperatorButton;
