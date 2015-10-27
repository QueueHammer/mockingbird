/* global document, localStorage, setTimeout */
(function () {
  var usTag = 'us_' + (Math.random() * 100000000).toFixed();
  
  var callBack = null;
  var task = [];
  var tasks = [];
  
  function findSelector(target) {
    if(!callBack) return;
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

    callBack(path.join(' > '));
    callBack = null;
  }
  
  function executeTask(task) {
    var step = 0;
    
    function click(target) {
      console.log('clicking: ', target);
      target.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
    }
    
    function takeStep() {
      var target = document.querySelector(task[step].el);
      if(target) click(target);
      
      step = step + 1;
      if(step != task.length) setTimeout(takeStep);
    }
    
    takeStep();
  }
  
  function waitForClick(cb) {
    setTimeout(function () { callBack = cb; });
  }
  
  function save (tasks) {
    localStorage.setItem('mockingbird', JSON.stringify(tasks));
  }
  
  function load () {
    return JSON.parse(localStorage.getItem('mockingbird'));
  }
  
  function bind() {
    tasks = load() || [];
    document.addEventListener("DOMContentLoaded", function() {
      document.addEventListener('click', function (e) { findSelector(e.target); });
      
      var container = document.createElement('div');
      container.innerHTML = '<div style="position:fixed; top:0; right:0; width:150px; height:200px; background: #fff; border: 1px solid #000;">';
      document.body.appendChild(container);
      
      var el = container.querySelector('div');
      document.body.appendChild(container);
      showTasks(el);
    });
  }
  
  function showTasks(el) {
    task = [];
    el.innerHTML = '';
    el.innerHTML = [
      '<div style="overflow: auto;">',
        '<input type="text" placeholder="task name" style="float: left; width: 100px">',
        '<span class="add" style="float: right;">+</span>',
      '</div>',
      '<div class="row" style="display: none">',       
      '</div>'
      
    ].join('');
    
    el.querySelector('.add')
    .addEventListener('click', function () {
      showAddTasks(el);
    });
    
    var row = el.querySelector('.row');
    tasks.forEach(function (task) {
      var newRow = row.cloneNode(true);
      newRow.style.display = 'block';
      newRow.innerText = task.name;
      
      newRow.addEventListener('click', function () {
        executeTask(task.task);
      });
      el.appendChild(newRow);
    });
  }
  
  function showAddTasks(el, name) {
    if(!name) { name = 'new task'; }
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
        '<span class="click">+click</span>',
      '</div>',
      '<div class="click-task" style="display: none; height: 16px; overflow: hidden;">',
        '<span class="task-description"></span>',
      '</div>'
    ].join('');
    
    
    el.querySelector('.quit')
    .addEventListener('click', function () {
      showTasks(el);
    });
    
    el.querySelector('.done')
    .addEventListener('click', function () {
      tasks.push({ name: name, task: task } );
      save(tasks);
      showTasks(el);
    });
    
    el.querySelector('.click')
    .addEventListener('click', function () {
      
      waitForClick(function (path) {
        var newTask = el.querySelector('.click-task')
        .cloneNode(true);

        newTask.style.display = 'block';
        newTask.querySelector('.task-description')
        .innerText = path;

        el.appendChild(newTask);
        
        task.push({ task: 'click', el: path });
      });
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