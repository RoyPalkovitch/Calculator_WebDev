//Iniziallize param
const display = document.getElementById('display');
const err = 'Error';
display.innerHTML = '0';
let num_1 = '0'; //first number displayed
let num_2 = ''; //second number displayed
let is_negative = false; //negative state
let is_float = false; // is number floating point
let operator = ''; //if operation
let current_result = NaN;
let calc_history = [];
function calculator(type, value) {
    switch (type) {
        case 'num':
            if (operator === '') {
                if (is_negative) {
                    num_1 = change_negative_state(num_1);
                    num_1 = show(num_1, value);
                    num_1 = change_negative_state(num_1);
                }
                else {
                    num_1 = show(num_1, value);
                }
                display.innerHTML = num_1;
            }
            else {
                if (is_negative) {
                    num_2 = change_negative_state(num_2);
                    num_2 = show(num_2, value);
                    num_2 = change_negative_state(num_2);
                }
                else {
                    num_2 = show(num_2, value);
                }
                display.innerHTML = num_1 + operator + num_2;
            }
            break;
        case 'negative_state':
            if (operator == '') {
                num_1 = change_negative_state(num_1);
                display.innerHTML = num_1;
            }
            else {
                if (num_2 === '') {
                    num_2 = '0';
                }
                num_2 = change_negative_state(num_2);
                display.innerHTML = num_1 + operator + num_2;
            }
            break;
        case 'operator':
            add_operator(value);
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
    if (num_2 === '' || zero_division()) {
        return;
    }
    math_operation();
    let temp = '';
    if (current_result < 0) {
        is_negative = false;
        temp = change_negative_state((current_result * -1).toString());
    }
    else {
        temp = current_result.toString();
    }
    clear();
    display.innerHTML = temp;
}
function clear() {
    display.innerHTML = '0';
    num_1 = '0';
    num_2 = '';
    is_negative = false;
    is_float = false;
    operator = '';
    current_result = NaN;
    calc_history = [];
    current_result = 0;
}
function back() {
    if (operator == '') {
        if (num_1.includes('-')) {
            is_negative = true;
            num_1 = change_negative_state(num_1);
            if (num_1[num_1.length - 1] === '.') {
                is_float = false; // is number floating point
            }
            num_1 = num_1.slice(0, num_1.length - 1);
            if (num_1 == '') {
                num_1 = '0';
                display.innerHTML = num_1;
                return;
            }
            num_1 = change_negative_state(num_1);
            display.innerHTML = num_1;
        }
        else {
            if (num_1[num_1.length - 1] === '.') {
                is_float = false; // is number floating point
            }
            num_1 = num_1.slice(0, num_1.length - 1);
            if (num_1 == '') {
                num_1 = '0';
            }
            display.innerHTML = num_1;
        }
    }
    else if (operator !== '' && num_2 === '') {
        display.innerHTML = num_1;
        operator = '';
    }
    else {
        if (is_negative) {
            num_2 = change_negative_state(num_2);
            if (num_2[num_2.length - 1] === '.') {
                is_float = false; // is number floating point
            }
            num_2 = num_2.slice(0, num_2.length - 1);
            if (num_2 === '') {
                display.innerHTML = num_1 + operator + num_2;
                return;
            }
            num_2 = change_negative_state(num_2);
            display.innerHTML = num_1 + operator + num_2;
        }
        else {
            if (num_2[num_2.length - 1] === '.') {
                is_float = false; // is number floating point
            }
            num_2 = num_2.slice(0, num_2.length - 1);
            display.innerHTML = num_1 + operator + num_2;
        }
    }
}
function change_negative_state(num) {
    is_negative = !is_negative;
    if (is_negative) {
        return '(-' + num + ')';
    }
    else {
        return num.slice(2, num.length - 1);
    }
}
function show(num, x) {
    if (x === '.' && !is_float) {
        is_float = true;
        return num + x;
    }
    else if (x === '.' && is_float) {
        return num;
    }
    if (num === '0' && !is_float) {
        return x;
    }
    else {
        return num + x;
    }
}
function add_operator(value) {
    if (num_2 === '') { //if not num2 we just add the operator
        if (display.innerHTML === err) {
            return;
        }
        if (operator === '') { //if there is no operator
            operator = value;
            display.innerHTML += operator; //display the operator
            is_float = false; //getting ready for num2
            is_negative = false;
        }
        else {
            display.innerHTML = display.innerHTML.slice(0, display.innerHTML.indexOf(num_1[num_1.length - 1]) + 1) + value + num_2;
            operator = value;
        }
    }
    else {
        if (zero_division()) {
            return;
        }
        math_operation();
        if (current_result < 0) {
            is_negative = false;
            num_1 = change_negative_state((current_result * -1).toString());
        }
        else {
            num_1 = current_result.toString();
        }
        //display.innerHTML += operation;
        operator = value;
        display.innerHTML = num_1 + operator;
        is_float = false;
        is_negative = false;
        num_2 = '';
    }
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
    if (num_2 === '') {
        return;
    }
    calc_history.push(num_1 + operator + num_2 + '=' + current_result);
    let elem = document.createElement("div");
    elem.innerText = calc_history[calc_history.length - 1];
    document.getElementById('history').childNodes[1].childNodes[1].appendChild(elem);
}