import React, { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperatorButton from "./OperatorButton";
import "./Styles.css";

/**
 *   ########## Different actions in the calculator ##########
 **/
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  OPERATOR: "operator",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evalute",
};


function reducer(state, { type, payload }) {
  switch (type) {
    /**
     *   ########## Digits operations like 1,2,3,4,5,6,7,8,9,0,. ##########
     **/
    case ACTIONS.ADD_DIGIT: {
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }

      if (payload.digit === "." && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: "0.",
        };
      }

      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    }

    /**
     *   ########## Operator operations like +, -, *, ÷ ##########
     **/
    case ACTIONS.OPERATOR: {
      if (state.currentOperand == null && state.previousOperand == null) {
        return {
          ...state,
          previousOperand: "0",
          operator: payload.operator,
          currentOperand: null,
          previousOperandIsZero: true,
        };
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operator: payload.operator,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operator: payload.operator,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evalutes(state),
        operator: payload.operator,
        currentOperand: null,
      };
    }

    /**
     *   ########## Evaluate operation '=' ##########
     **/
    case ACTIONS.EVALUATE: {
      if (state.currentOperand == null) {
        return {
          ...state,
          currentOperand: state.previousOperand,
          previousOperand: null,
          operator: null,
        };
      }

      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operator == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        currentOperand: evalutes(state),
        previousOperand: null,
        operator: null,
      };
    }

    /**
     *   ########## Delete operation ##########
     **/
    case ACTIONS.DELETE_DIGIT: {
      if (state.previousOperandIsZero) {
        return {
          ...state,
          currentOperand: "0",
          previousOperand: null,
          operator: null,
        };
      }

      if (state.currentOperand == null) {
        return state;
      }

      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: del(state),
      };
    }

    /**
     *    ########## Clear operation to erase everything in display ##########
     **/
    case ACTIONS.CLEAR: {
      return {};
    }
  }
}

/**
 *    ########## Delete operation when previousOperand is Zero && operand is anything ##########
 **/
function del({ currentOperand, overwrite }) {
  if (overwrite) {
    return currentOperand;
  } else {
    return currentOperand.slice(0, -1);
  }
}

/**
 *   ########## Evalaute operation to get the result of previosOperand && currendOperand ##########
 **/
function evalutes({ currentOperand, previousOperand, operator }) {
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(previous) || isNaN(current)) {
    return "";
  }

  let result = "";
  switch (operator) {
    case "+":
      result = previous + current;
      break;
    case "-":
      result = previous - current;
      break;
    case "*":
      result = previous * current;
      break;
    case "÷":
      result = previous / current;
      break;
  }
  return result.toString();
}

/**
 *   ########## Number formatting function. ##########
 **/
const INTERGER_FORMATTER = new Intl.NumberFormat("en-In", {
  maximumFractionDigits: 0,
});

function formatNumber(number) {
  if (number == null) {
    return null;
  }
  const [integer, decimal] = number.split(".");
  if (decimal == null) {
    return INTERGER_FORMATTER.format(integer);
  }
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`;
}

/**
 *   ########## Main function. ##########
 **/
function App() {
  
  const [{ currentOperand, previousOperand, operator }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="calulations-result">
        <div className="previous-operand">
          {formatNumber(previousOperand)}
          {operator}
        </div>
        <div className="current-operand">{formatNumber(currentOperand)}</div>
      </div>
      <button
        className="span-2"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperatorButton operator="÷" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperatorButton operator="×" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperatorButton operator="-" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperatorButton operator="+" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-2"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;


