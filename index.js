"use strict";
var addButton = document.getElementById('add');
var inputTask = document.getElementById('new-task');
var unfinishedTasks = document.getElementById('unfinished-tasks');
var finishedTasks = document.getElementById('finished-tasks');
var finishedTasksArr = [];
var unfinishedTasksArr = [];

function createNewElement(task, finished) {
    var listItem = document.createElement('li');
    var checkbox = document.createElement('button');
    var editButton = document.createElement('button');
    var label = document.createElement('label');
    var input = document.createElement('input');
    var deleteButton = document.createElement('button');

    if(finished){
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>"; 
        editButton.className = "material-icons edit";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        editButton.disabled = true;
    }else {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
        editButton.className = "material-icons edit";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        editButton.disabled = false;
    }

    label.innerText = task;
    label.draggable = true;
    input.type = "text";   
    deleteButton.className = "material-icons delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);
    return listItem;
}

function addTask() {
    if (inputTask.value != "") {
        var listItem = createNewElement(inputTask.value, false);
        unfinishedTasks.appendChild(listItem);
        bindTaskEvents(listItem, finishTask)
        inputTask.value = "";
    }else alert("Вы не можете вводить пустые задания");
    save();
}

addButton.onclick = addTask;
inputTask.onchange = addTask;

function deleteTask() {
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    ul.removeChild(listItem);
    save();
}

function editTask() {
    var listItem = this.parentNode;
    var editButton = this;
    var label = listItem.querySelector('label');
    var input = listItem.querySelector('input[type=text]');

    var containsClass = listItem.classList.contains('editMode');
    
    if (containsClass) {
        label.innerText = input.value;
        editButton.className = "material-icons edit";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        save();
    } else {
        input.value = label.innerText;
        editButton.className = "material-icons save";
        editButton.innerHTML = "<i class='material-icons'>save</i>";
    }
    listItem.classList.toggle('editMode');
}

function finishTask() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box</i>";

    finishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, unfinishTask);
    save();
}

function unfinishTask() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');

    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";

    unfinishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);
    save();
}

function bindTaskEvents(listItem, checkboxEvent) {
    var checkbox = listItem.querySelector('button.checkbox');
    var editButton = listItem.querySelector('button.edit');
    var deleteButton = listItem.querySelector('button.delete');

    checkbox.onclick = checkboxEvent;
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
}

function save() {
    console.log(unfinishedTasks.children);
    var unfinishedTasksArr = [];
    for (var i = 0; i < unfinishedTasks.children.length; i++) {
        unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }

    var finishedTasksArr = [];
    for (var i = 0; i < finishedTasks.children.length; i++) {
        finishedTasksArr.unshift(finishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }

    localStorage.removeItem('todo');
    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks: unfinishedTasksArr,
        finishedTasks: finishedTasksArr
    }));
}

function load(){
    return JSON.parse(localStorage.getItem('todo'));
}

var data=load();
console.log(data);


for(var i=0; i<data.unfinishedTasks.length;i++){
    var listItem=createNewElement(data.unfinishedTasks[i], false);
    unfinishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);
}

for(var i=0; i<data.finishedTasks.length; i++){
    var listItem=createNewElement(data.finishedTasks[i], true);
    finishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, unfinishTask);
}

var arr = [];  
function allowDrow(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("content", ev.target.textContent);
}

function drop(ev, block) {
    var label = document.createElement('label');
    var content = ev.dataTransfer.getData("content");
    // console.log(block); 
    // console.log(content);
    // console.log(arr);
    // console.log(finishedTasksArr);
    // console.log(arr.indexOf(content));
    var unfinishedTasks = JSON.parse(localStorage.getItem('todo')).unfinishedTasks;
    var finishedTasks = JSON.parse(localStorage.getItem('todo')).finishedTasks;
    // console.log(unfinishedTasks);
    // console.log(finishedTasks);
    if(block.id == "div1"){
        // if(unfinishedTasks.indexOf(content) == -1){
        // unfinishedTasks.push(content);
        // }
        if(unfinishedTasks.indexOf(content) == -1){
            var index = finishedTasks.indexOf(content);
            // console.log(index);
            // finishedTasksc
            unfinishedTasks.push(content);
            finishedTasks.splice(finishedTasks.indexOf(content), 1);
            location.href=location.href;
         }
    }
    if(block.id == "div2"){
        if(finishedTasks.indexOf(content) == -1){
            var index = unfinishedTasks.indexOf(content);
            // console.log(index);
            finishedTasks.push(content);
            unfinishedTasks.splice(unfinishedTasks.indexOf(content), 1);
            location.href=location.href;
        }
    }
    // console.log(unfinishedTasks);
    // console.log(finishedTasks);
    block.appendChild(label);
    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks: unfinishedTasks,
        finishedTasks: finishedTasks
    }));
}