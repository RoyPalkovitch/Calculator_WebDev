const display: Element = document.getElementById('display');
const ERR: string = 'Error';
display.innerHTML = '0';
let remote = false;
let num_1: string= '0';//first number displayed
let eq = false;
const operators: { '*': string, '/': string, '-': string, '+': string, '%':string } = {
  '*': '*',
  '/': '/',
  '-': '-',
  '+': '+',
  '%': '%'
};

const sciOperators: { '^': string, 'root': string } = {
  '^': '^',
  'root': 'root'
};


let num_2 = '';
let sciOper = '';
let operCount: number = 0;

let calc_history: string[] = [];

let state: boolean = false;
let floatBefore: boolean = false;
let wasChanged: boolean = false;

function calculator(type: string, value: string) {
  switch (type) {
    case 'num':

      addNumbers(value);
      render();
      break;

    case 'float':
      if(num_1[num_1.length-1] === 't' || sciOperators[num_1[num_1.length-1]] || num_1[num_1.length] === 'π'){
        return;
      }
      addFloat();
      render();
      break;

    case 'negative_state':
      if(num_1[num_1.length-1] === 't' || sciOperators[num_1[num_1.length-1]] || num_1[num_1.length-1] === 'π'){
        return;
      }
      num_1 = toNegative(num_1);
      render();
      break;

    case 'operator':
      if(num_1[num_1.length-1] === 't' || sciOperators[num_1[num_1.length-1]]){
        return;
      }
      if(sciOper){
        sciCalc();
      }
      addOperation(value);
      render();
      break;


    case 'back':
      back();
      render();
      break;


    case 'clear':
      clear();
      break;

    case 'eq':
      if(sciOper){
        sciCalc();
      }
        equal();
      break;


  }
}

async function sciCalc(){
  let lastNumRange = searchLastNumber(num_1);
  let temp: string | number = num_1.slice(lastNumRange[0]);
  switch(sciOper){
    case '^':

      if(remote){
        num_2 = await remoteCalc((parseFloat(num_2)+ '^' + parseFloat(temp)).toString());
      }else{
        num_2 = Math.pow(parseFloat(num_2), parseFloat(temp)).toString();
      }

      break;
    case 'root':{

      if(remote){
        num_2 = await remoteCalc(num_2 + '^' + '1/'+temp);
      }else{
      num_2 = Math.pow(parseFloat(num_2), (1/parseFloat(temp))).toString();
     }
      break;
    }

  }
  temp = num_1.slice(0, lastNumRange[0]-1);
  lastNumRange = searchLastNumber(temp);
  num_1 = num_1.slice(0, lastNumRange[0]) + num_2;
  sciOper = '';
  num_2 = '';
  render();
}



async function sciOperator(type: string, value:string ='') {
  if(operators[num_1[num_1.length-1]]){
    return;
  }
  switch (type) {
    case 'square':
      if (isNegative(num_1)) {
        num_1 = toNegative(num_1);
      }
      let lastNumRange = searchLastNumber(num_1);
      let temp: string | number = num_1.slice(lastNumRange[0]);
      if (remote) {
        temp = await remoteCalc((parseFloat(temp) + '^' + 2).toString());
      }else{
        temp = Math.pow(parseFloat(temp), 2).toString();
      }
      num_1 = num_1.slice(0, lastNumRange[0]) + temp;

      render();
      break;

    case 'sqroot':
      if (isNegative(num_1)) {
        break;
      } else {
        let lastNumRange = searchLastNumber(num_1);
        let temp: string | number = num_1.slice(lastNumRange[0]);
        if (remote) {
          temp = await remoteCalc('sqrt(' + parseFloat(temp).toString() + ')' );
        } else {
          temp = Math.sqrt(parseFloat(temp)).toString();
        }
        num_1 = num_1.slice(0, lastNumRange[0]) + temp;
        render();
      }
      break;
          
    case 'addSci':{  
      let lastNumRange = searchLastNumber(num_1);
      let temp: string | number = num_1.slice(lastNumRange[0]);
      if(sciOper && (num_1[num_1.length-1] === 't' || sciOperators[num_1[num_1.length-1]])){
        temp = num_1.replace(sciOper, value);
        num_1 = temp;
      }else if(!sciOper){
        num_1 += value;
      }else{
        return;
      }         
      num_2 = temp;
      sciOper = value;
      render();
      break;
    }
  }
}

function addNumbers(value: string) {
  if(eq){
    num_1= '0';
    eq = false;
  }
  if(value === 'Math.PI'){
    value = 'π';
  }
  if(num_1[num_1.length-1] === 'π' && value === 'π'){
    return;
  } else if (num_1[num_1.length-1] === 'π' && value !== 'π'){
    num_1 += '*';
  }


  if(!operators[num_1[num_1.length-1]] && value === 'π' && num_1 !== '0'){
    num_1 += '*';
    operCount++;
  }

  if (isNegative(num_1)) {
    num_1 = toNegative(num_1);
    wasChanged = !wasChanged;
  }
  if (num_1 === '0') {
    num_1 = value;
  } else if (operators[num_1[num_1.length - 2]] && num_1[num_1.length - 1] === '0') {
    num_1 = num_1.slice(0, num_1.length - 1) + value;
  }
  else {
    num_1 += value;
  }
  if (wasChanged) {
    num_1 = toNegative(num_1);
    wasChanged = !wasChanged;
  }
}

async function addOperation(value: string) {

  if (operCount == 1 && !state) {
    eq = true;
    update_history(true);
    if (remote) {
      num_1 = num_1.replaceAll('π', ' PI ');
      num_1 = await remoteCalc(num_1);
    } else {
      num_1 = num_1.replaceAll('π', ' Math.PI ');
      num_1 = eval(num_1);
    }
    update_history(false);
    operCount = 0;
  } else if (state && operCount == 2) {
    eq = true;
    update_history(true);
    if (remote) {
      num_1 = num_1.replaceAll('π', ' PI ');
      num_1 = await remoteCalc(num_1);
    } else {
      num_1 = num_1.replaceAll('π', ' Math.PI ');
      num_1 = eval(num_1);
    }
    update_history(false);
    operCount = 0;
  }
  if (!operators[num_1[num_1.length - 1]]) {
    eq = false;
    num_1 += value;
    operCount++;
  } else {
    eq = false;
    num_1 = num_1.slice(0, num_1.length - 1);
    num_1 += value;
  }
  floatBefore = false;
}

function isNegative(num:string): boolean {
  return num[num.length - 1] === ')';
}

function toNegative(num:string): string {
  if (operators[num[num.length - 1]]) {
    num += '0';
  }
  let range: number[] = searchLastNumber(num);
  if (isNegative(num)) {
    let tempNumMinus = num.slice(range[0] - 2, range[1] + 1);
    let tempNumClean = tempNumMinus.slice(2, tempNumMinus.length - 1);
    num = num.replace(tempNumMinus, tempNumClean)
  } else {
    let targetNum: string = num.slice(range[0]);
    num = num.substring(0, range[0]) + '-' + targetNum;
  }
  return num;
}

function isFloat(num: string) {
  return num.includes('.');
}

function addFloat() {
  if (operators[num_1[num_1.length - 1]] || num_1[num_1.length - 1] === '.' || floatBefore) {
    return;
  }
  if (isNegative(num_1)) {
    num_1 = toNegative(num_1);
    wasChanged = !wasChanged;
  }
  num_1 += '.';
  if (wasChanged) {
    num_1 = toNegative(num_1);
    wasChanged = !wasChanged;
  }
  floatBefore = true;
}

function searchLastNumber(num:string) {
  let range: number[] = [];
  let last: number = num.length - 1;
  for (let i:number = last; i >= 0; i--) {
    if (operators[num[last]] || sciOperators[num[last]] || num[last] === 't') {
      continue;
    } else {
      if (!range[0]) {
        range.push(i);
      } else {
        if (operators[num[i]] || sciOperators[num[i]] || num[i] === 't') {
          if (range[0] === i + 1) {
            break;
          }
          range.push(i + 1);
          break;
        } else if (i === 0) {
          range.push(i);
        }
      }
    }
  }
  return range.reverse();
}

function back() {

  if (operators[num_1[num_1.length - 1]]) {
    operCount--;
    num_1 = num_1.slice(0, num_1.length - 1);
    if (num_1.includes('.')) {
      floatBefore = true;
    }
    return;
  }
  if(num_1[num_1.length-1] === 't'){
    num_1 = num_1.replace('root','');
    sciOper = '';
    return;
  }else if(sciOperators[num_1[num_1.length-1]]){
    num_1 = num_1.replace('^','');
    sciOper = '';
    return;
  }

  if (isNegative(num_1)) {
    num_1 = toNegative(num_1);
    wasChanged = !wasChanged;
  }
  if (num_1[num_1.length - 1] === '.') {
    floatBefore = false;
  }
  num_1 = num_1.slice(0, num_1.length - 1);
  if (wasChanged) {
    if (num_1 && !operators[num_1[num_1.length - 1]]) {
      num_1 = toNegative(num_1);
    }
    wasChanged = !wasChanged;
  }
  if (!num_1) {
    num_1 = '0';
  }
}

function reset() {
  operCount = 0;
  num_2 = '';
  sciOper = '';
  floatBefore = false;
  wasChanged = false;
}

function clear() {
  reset();
  num_1 = '0';
  let historyTitle: Element = document.getElementById('history').children[0].children[0].children[0];
  document.getElementById('history').children[0].children[0].innerHTML = '';
  document.getElementById('history').children[0].children[0].appendChild(historyTitle);
  calc_history = [];
  render();
}

function update_history(createNew:Boolean) {
  const history = document.getElementById('history').children[0].children[0];
  if(createNew){
    let elem:Element = document.createElement("div");
    elem.innerHTML = num_1;
    history.appendChild(elem);
  }else{
    history.children[history.children.length-1];
  }
}

async function equal() {
  update_history(true);
  eq = true;
  if(remote){
    num_1 = num_1.replaceAll('π', ' PI ');
    num_1 = await remoteCalc(num_1);
  }else{
    num_1 = num_1.replaceAll('π', ' Math.PI ');
    num_1 = eval(num_1).toString();
  }
  update_history(false);

  reset();
  render();
}

function addSpace() {
  let temp:string = '';
  for (let i = 0; i < num_1.length; i++) {
    if (operators[num_1[i]]) {
      temp += ' ';
      temp += num_1[i];
      temp += ' ';
      continue;
    }
    temp += num_1[i];
  }
  num_1 = temp;
}

function removeSpace() {
  num_1 = num_1.replaceAll(' ', '');
}

function render() {
  addSpace();
  display.innerHTML = num_1;
  removeSpace();
}

async function remoteCalc(num:string):Promise<string>{
  document.body.style.pointerEvents= 'none';
  return fetch('http://api.mathjs.org/v4/?expr=' + encodeURIComponent(num),{
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.text())
  .then(response => response)
  .finally( () => document.body.style.pointerEvents= '');
}