//Iniziallize param
const display: Element = document.getElementById('display');
const err: string = 'Error';
display.innerHTML = '0';
let num_1: string = '0';//first number displayed
let num_2: string = '';//second number displayed
let operator: string = ''; //if operation
let operator_sience: string = ''; //if operation
let waitingNextOper: string = '';
let current_result: number = NaN;
let calc_history: string[] = [];

function calculator(type: string, value: string) {
  switch (type) {
    case 'num':
      if (!operator) { //if we haven't set an operator
        num_1 = write(num_1, value);
        display.innerHTML = num_1;
      } else {
        num_2 = write(num_2, value);
        display.innerHTML = num_1 + operator + num_2;
      }
      break;

    case 'float':
      if (!operator) {
        num_1 = addFloat(num_1);
        display.innerHTML = num_1;
      }
      else {
        num_2 = addFloat(num_2);
        display.innerHTML = num_1 + operator + num_2;
      }
      break;

    case 'negative_state':
      if (!operator) {
        num_1 = change_negative_state(num_1);
        display.innerHTML = num_1;

      } else {
        num_2 = change_negative_state(num_2);
        display.innerHTML = num_1 + operator + num_2;
      }
      break;

    case 'operator':
      if (!num_2) {
        insertFirstOperator(value);
      } else {
        add_operator(value);
      }
      break;

    case 'back':
      back();
      break;


    case 'clear':
      clear();
      break;

    case 'eq':
      equal();
      break;


  }
}

function insertFirstOperator(value: string) {
  operator = value;
  display.innerHTML = num_1 + operator;
}


function add_operator(value: string) {// adding the operator

  if (zero_division()) {
    return;
  }

  if (science && !waitingNextOper) {
    waitingNextOper = operator;
    num_1 = num_1 + operator + num_2;
    num_2 = '';
    operator = value;
    display.innerHTML = num_1 + value;
    return;
  }
  math_operation();

  if (current_result < 0) {
    num_1 = change_negative_state((current_result * -1).toString());
  } else {
    num_1 = current_result.toString();
  }

  resetAfterOper(value);
}


function equal() {
  if (!num_2 || zero_division()) {
    return;
  }
  math_operation();
  let temp = '';
  if (current_result < 0) {
    temp = change_negative_state((current_result * -1).toString());
  } else {
    temp = current_result.toString();
  }
  clear();
  display.innerHTML = temp;

}

function clear() {
  display.innerHTML = '0';
  num_1 = '0';
  num_2 = '';
  operator = '';
  waitingNextOper = '';
  current_result = NaN;
  calc_history = [];
  current_result = 0;

}

function back() {
  if (!operator) {
    if (num_1.includes('-')) {
      num_1 = change_negative_state(num_1);

      num_1 = num_1.slice(0, num_1.length - 1);
      if (!num_1) {
        num_1 = '0';
        display.innerHTML = num_1;
        return;
      }
      num_1 = change_negative_state(num_1);
      display.innerHTML = num_1;
    } else {

      num_1 = num_1.slice(0, num_1.length - 1);
      if (num_1 == '') {
        num_1 = '0';
      }
      display.innerHTML = num_1;
    }
  } else if ((operator || waitingNextOper) && !num_2) {
    if (waitingNextOper) {
      num_2 = num_1.split(waitingNextOper)[1];
      num_1 = num_1.split(waitingNextOper)[0];
      operator = waitingNextOper;
      waitingNextOper = '';
      display.innerHTML = num_1 + operator + num_2;
    } else {
      operator = '';
      display.innerHTML = num_1;
    }
  }
  else {
    if (num_2.includes('-')) {
      num_2 = change_negative_state(num_2);

      num_2 = num_2.slice(0, num_2.length - 1);
      if (!num_2) {
        display.innerHTML = num_1 + operator + num_2;
        return;
      }
      num_2 = change_negative_state(num_2);
      display.innerHTML = num_1 + operator + num_2;

    } else {

      num_2 = num_2.slice(0, num_2.length - 1);

      display.innerHTML = num_1 + operator + num_2;
    }
  }
}

function change_negative_state(num: string) {

  if (!num) {
    num = '0';
  }
  if (num.includes('-')) {
    return num.slice(2, num.length - 1);
  } else {
    return '(-' + num + ')';
  }

}

function write(num: string, value: string) {
  let minus = false;
  if (num.includes('-')) {
    minus = true;
    num = change_negative_state(num);
  }
  if (num === '0' || !num) {
    num = value;
    if (minus) {
      num = change_negative_state(num);
    }
    return num;
  }
  else {
    num = num + value;
    if (minus) {
      num = change_negative_state(num);
    }
    return num
  }
}

function addFloat(num: string) {
  if (num.includes('.')) {
    return num;
  }
  else {
    if (!num) {
      num = '0';
    }
    if (num.includes('-')) {
      num = change_negative_state(num);
      num += '.';
      num = change_negative_state(num);
    } else {
      num += '.';
    }
    return num
  }
}



function resetAfterOper(value: string) {
  operator = value;
  waitingNextOper = '';
  display.innerHTML = num_1 + operator;
  num_2 = '';
  return;
}


function math_operation() {
  current_result = parseFloat(eval(num_1 + operator + num_2));
  update_history();
}

function zero_division() {
  if ((num_2 === '0' || num_2 === '(-0)') && operator == '/') {
    clear();
    display.innerHTML = err;
    return true;
  }
  return false;
}

//if a calculation happend save and display to history window
function update_history() {
  if (!num_2) {
    return;
  }
  calc_history.push(num_1 + operator + num_2 + '=' + current_result);

  let elem = document.createElement("div");
  elem.innerText = calc_history[calc_history.length - 1];
  document.getElementById('history').childNodes[1].childNodes[1].appendChild(elem);
}