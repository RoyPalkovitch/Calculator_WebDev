
function info() {
  alert('Developer: Roy Palkovitch\nVersion: 0.01\n Calculator for WebDev program');
}

function toggle_theme() {
  let body = document.getElementsByTagName('body')[0];
  if (body.className === "") {
    body.className = 'dark';
  }
  else {
    body.className = '';
  }
}


function toggle(tag, should_active) {
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
}
