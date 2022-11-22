let science: boolean = false;

const buttons = () =>{
  let buttonArray: HTMLCollection;
  buttonArray = document.getElementById('left').children[0].children;
  for(let i = 0; i < buttonArray.length; i++){
    if(buttonArray[i].id){
      buttonArray[i].addEventListener('click', (e) =>{
        toggleButtons(buttonArray[i])
      });
    }
  }
  buttonArray = document.getElementById('center').children[0].children;
  for(let i = 2; i < buttonArray.length; i++){
    if( i === 2){
    buttonArray[i].addEventListener('click', (e) =>{
      calculator(buttonArray[i].id, '');
    });
    }else{
      let rows: HTMLCollection = buttonArray[i].children;
      for(let j = 0; j < rows.length; j++){
        if( i === buttonArray.length - 1 && j === 0){
          rows[j].addEventListener('click', (e) => {
            calculator(rows[j].id, '');
          })
        }else{
        rows[j].addEventListener('click', (e) =>{
          calculator('num', rows[j].innerHTML);
        });}
      }
    }
  };
};


function toggleButtons(tag:Element){
  switch(tag.id){
    case 'show-info':
      info();
      break;
    
    case 'light-mode':
      toggle_theme();
      break;
    
    case 'show-history':
    case 'show-scientific':
      toggle_view(tag, true);
      break;
    
    case 'remote-calc':
      toggle_view(tag, false);
      break;

  }
}







function info() {
  alert('Developer: Roy Palkovitch\nVersion: 0.01\n Calculator for WebDev program');
}

function toggle_theme() {
  document.body.classList.toggle('dark');
}


function toggle_view(tag: Element, should_active: boolean) {
  if (tag.classList.length < 2) {
    tag.classList.add('active');
    if (should_active) {
      document.getElementById(tag.id.split('-')[1]).style.display = 'grid';
    }
  } else {
    tag.classList.remove('active');
    if (should_active) {
      document.getElementById(tag.id.split('-')[1]).style.display = 'none';
    }
  }

  if(tag.id.split('-')[1] === 'scientific'){
    science = !science;
    clear();
  }
}

function changeSettings(){
  let query:string | string[] = window.location.search.split('&');
  if(query){
    for(let i:number = 0; i < query.length ; i++){
      let current : string[] = query[i].split('=');
      if(current[0].includes('color')){
        document.body.style.backgroundColor = current[1].replace('%','#')
      }else if (current[0] === 'font'){
        if(current[1].includes('+')){
          current[1] = current[1].replaceAll('+',' ');
        }
        document.body.style.fontFamily = current[1];
      }else{
        document.body.classList.add(current[1]);
      }
    }
  }
}
addEventListener('DOMContentLoaded',() => {
  changeSettings();
  buttons();
});