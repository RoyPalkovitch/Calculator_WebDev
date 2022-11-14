
function info(){
  alert('Developer: Roy Palkovitch\nVersion: 0.01\n Calculator for WebDev program');
}

function toggle_theme(){
  let body = document.getElementsByTagName('body')[0];
  if (body.className === ""){
    body.className = 'dark';
  }
  else{
    body.className = '';
  }
}

function toggle_history(){
  let history = document.getElementById('show-history');
  if (history.classList.length < 2){
    history.classList.add('active');
    history = document.getElementById('history').style.display='grid';

  }else{
    history.classList.remove('active');
    history = document.getElementById('history').style.display='none';

  }
}

function toggle_scientific(){
  let scientific = document.getElementById('show-scientific');
  if (scientific.classList.length < 2){
    scientific.classList.add('active');
    scientific = document.getElementById('scientific').style.display='grid';

  }else{
    scientific.classList.remove('active');
    scientific = document.getElementById('scientific').style.display='none';

  }
}