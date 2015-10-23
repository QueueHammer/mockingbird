/* global document, localStorage */
(function () {
  var usTag = 'us_' + (Math.random() * 100000000).toFixed();
  
  function findSelector(target) {
    var now = target;

    var path = [];

    while(now) {
      if (now.id) {
        path.unshift('#' + now.id);
        break;
      }

      var nodeName = now.nodeName;
      
      var siblings = 0;
      while(now.previousElementSibling) {
        siblings = siblings + 1;
        now = now.previousElementSibling;
      }

      path.unshift(nodeName + siblings ? ':nth-child(' + (siblings + 1) + ')' : '');

      now = now.parentElement;
    }

    return path.join(' > ');
  }
  
  function save (tasks) {
    localStorage.setItem('mockingbird', JSON.stringify(tasks));
  }
  
  function load () {
    return JSON.parse(localStorage.getItem('mockingbird'));
  }
  
  function bind() {
    document.addEventListener("DOMContentLoaded", function() {
      var container = document.createElement('div');
      container.innerHTML = '<div style="position:fixed; top:0; right:0; width:150px; height:200px; background: #fff; border: 1px solid #000;">';
      document.body.appendChild(container);
      
      var el = container.querySelector('div');
      document.body.appendChild(container);
      showTasks(el);
    });
  }
  
  function showTasks(el) {
    el.innerHTML = '';
    el.innerHTML = [
      '<div style="overflow: auto;">',
        '<input type="text" placeholder="task name" style="float: left; width: 100px">',
        '<span class="add" style="float: right;">+</span>',
      '</div>'
    ].join('');
    
    el.querySelector('.add')
    .addEventListener('click', function () {
      showAddTasks(el);
    });
  }
  
  function showAddTasks(el, name) {
    if(!name) name = 'new task';
    el.innerHTML = '';
    
    el.innerHTML = [
      '<div>',
        '<input type="text" placeholder="task name" style="width: 100px;">',
        '<span style="float: right;">',
        '<span class="done">ok</span>',
        '/',
        '<span class="quit">x</span>',
        '</span>',
      '</div>',
      '<div>',
        '<span>Add: </span><span class="click">click</span>',
      '</div>',
      '<div class="click-task" style="display: none;">',
        '<span class="task-description"></span>',
      '</div>'
    ].join('');
    
    
    el.querySelector('.quit')
    .addEventListener('click', function () {
      showTasks(el);
    });
    
    el.querySelector('.click')
    .addEventListener('click', function () {
      var newTask = el.querySelector('.click-task')
      .cloneNode(true);
      
      newTask.style.display = 'block';
      newTask.querySelector('.task-description')
      .innerText = 'something...';
      
      el.appendChild(newTask);
    });
  }

  /*
  $(document).on('click', function (e) {
    console.log(findSelector(e.target));
  });

  document.addEventListener("keypress", function () {
    console.log(arguments);
  });
  */
  
  bind();
})();