  //Iniziallize param
  const display = document.getElementById('display');
  display.innerHTML = '0';
  let num_1 = '0';//first number displayed
  let num_2 = '';//second number displayed
  let is_negative = false; //negative state
  let is_float = false; // is number floating point
  let operation = ''; //if operation
  let current_result = NaN;
  let calc_history = [];
  function calculator(type, value) {

    switch (type) {
      case 'num':
        if (operation == '') {
          if (is_negative) {
            num_1 = change_negative_state(num_1);
            num_1 = show(num_1, value);
            num_1 = change_negative_state(num_1);
          } else {
            num_1 = show(num_1, value);
          }
          display.innerHTML = num_1;
        } else {

          if (is_negative) {
            num_2 = change_negative_state(num_2);
            num_2 = show(num_2, value);
            num_2 = change_negative_state(num_2);
          } else {
            num_2 = show(num_2, value);
          }
          display.innerHTML = num_1 + operation + num_2;
        }
        break;

      case 'negative_state':
        if (operation == '') {
          num_1 = change_negative_state(num_1);
          display.innerHTML = num_1;

        } else {
          if (num_2 === '') {
            num_2 = 0;
          }
          num_2 = change_negative_state(num_2);
          display.innerHTML = num_1 + operation + num_2;
        }
        break;

      case 'operation':
        add_operation(value)
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

  function equal() {
    math_operation();
    let temp = '';
    if (current_result < 0){
      is_negative = false;
      temp = change_negative_state((current_result*-1).toString())
    }else{
    temp = current_result.toString();}
    clear();
    display.innerHTML = temp;
    num_1 = '0';
    current_result = 0;
  }

  function clear() {
    display.innerHTML = '0';
    num_1 = '0';
    num_2 = '';
    is_negative = false;
    is_float = false;
    operation = '';
    current_result = NaN;
    calc_history = [];
  }

  function back() {
    if (operation == '') {
      if (num_1.includes('-')) {
        is_negative = true;
        num_1 = change_negative_state(num_1);
        num_1 = num_1.slice(0, num_1.length - 1);
        if (num_1 == '') {
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
    } else if (operation !== '' && num_2 === '') {
      display.innerHTML = num_1;
      operation = '';
    }
    else {
      if (is_negative) {
        num_2 = change_negative_state(num_2);
        num_2 = num_2.slice(0, num_2.length - 1);
        if (num_2 === '') {
          display.innerHTML = num_1 + operation + num_2;
          return;
        }
        num_2 = change_negative_state(num_2);
        display.innerHTML = num_1 + operation + num_2;

      } else {
        num_2 = num_2.slice(0, num_2.length - 1);

        display.innerHTML = num_1 + operation + num_2;
      }
    }
  }
  function change_negative_state(num) {
    is_negative = !is_negative;
    if (is_negative) {
      return '(-' + num + ')';
    } else {
      return num.slice(2, num.length - 1);
    }

  }


  function show(num, x) {
    if (x === '.' && !is_float) {
      is_float = true;
      return num + x;
    } else if (x === '.' && is_float) {
      return num
    }

    if (num === '0' && !is_float) {
      return x;
    }
    else {
      return num + x
    }
  }

  function add_operation(value) {
    if (num_2 === '') {
      if (operation === '') {
        operation = value;
        display.innerHTML += operation;
        is_float = false;
        is_negative = false;
      } else {
        display.innerHTML = display.innerHTML.slice(0, display.innerHTML.indexOf(num_1[num_1.length - 1]) + 1) + value + num_2;
        operation = value
      }
    } else {
      math_operation();
      operation = value;
      if (current_result < 0) {
        is_negative = false;
        num_1 = change_negative_state((current_result * -1).toString());
      } else {

        num_1 = current_result.toString();
      }
      //display.innerHTML += operation;
      display.innerHTML =num_1 + operation;
      is_float = false;
      is_negative = false;
      num_2 = '';
    }
  }

  function math_operation() {
    let val_1 = 0;
    let val_2 = 0;
    if (num_1.includes('-')) {
      is_negative = true;
      num_1 = change_negative_state(num_1);
      if (num_1.includes('.')) {
        val_1 = parseFloat(num_1) * -1;
      } else {
        val_1 = parseInt(num_1) * -1;
      }
      num_1 = change_negative_state(num_1);
    }
    else {
      if (num_1.includes('.')) {
        val_1 = parseFloat(num_1);
      } else {
        val_1 = parseInt(num_1);
      }
    }
    if (num_2.includes('-')) {
      is_negative = true;

      num_2 = change_negative_state(num_2);
      if (num_2.includes('.')) {
        val_2 = parseFloat(num_2) * -1;
      } else {
        val_2 = parseInt(num_2) * -1;
      }
      num_2 = change_negative_state(num_2);
    }
    else {
      if (num_2.includes('.')) {
        val_2 = parseFloat(num_2);
      } else {
        val_2 = parseInt(num_2);
      }
    }

      switch (operation) {
        case '+':
          current_result = (val_1 + val_2);
          break;

        case '-':
          current_result = (val_1 - val_2);
          break;

        case '/':
          current_result = (val_1 / val_2);
          break;
        case 'X':
          current_result = (val_1 * val_2);
          break;

      }
      update_history();
  }

  function update_history(){
    calc_history.push(num_1 + operation + num_2 + '=' + current_result);
    for (let i = 0; i < history.length; i++){
      let elem = document.createElement("div");
      elem.innerText = calc_history[calc_history.length-1];
      document.getElementById('history').childNodes[1].childNodes[1].appendChild(elem);
    }
    
  }