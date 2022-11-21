let science: boolean = false;



function info() {
  alert('Developer: Roy Palkovitch\nVersion: 0.01\n Calculator for WebDev program');
}

function toggle_theme() {
  document.body.classList.toggle('dark');
}


function toggle(tag: Element, should_active: boolean) {
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
  changeSettings()
});