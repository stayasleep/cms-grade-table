/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var studentArray=[];
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(initializeSGT);

function initializeSGT(){
    $('.studentAdd').click(addClicked);
    $('.cancel').click(cancelClicked);
    $('.loadIt').click(dataResponse);
    $('.upbtn').click(updateStudentInfo);
    reset();
}
/**
 * addClicked - Event Handler when user clicks the add button // function is executed when add button is clicked..it will call addStudent and UpdatetudentList will also call clearAddStudentFOrm
 */
function addClicked(){
    var name=$('#studentName').val();
    var grades = $('#studentGrade').val();
    var courses = $('#course').val();
    if(name==="" || grades==="" || courses===""){
        generalModal("Please fill in all the required fields","Close");
        $('#genModal').modal();
        return false;
    }else {
        addStudent(name,grades,courses);
        updateStudentList();
        clearAddStudentForm();
    }
}
function generalModal(str,str2){
    var innerDiv = $('<div>',{
        class:"modal-body"
    });
    var innerP=$('<p>',{
        class:"modal-str",
        text: str
    });
    innerDiv.append(innerP);
    var innerDiv2=$('<div>',{
        class:"modal-footer"
    });
    var innerBtnX=$('<button>',{
        type:"button",
        class:"btn btn-danger",
        "data-dismiss":"modal",
        text:str2
    });
    innerDiv2.append(innerBtnX);
    var midDiv = $('<div>',{
        class:"modal-content"
    });
    midDiv.append(innerDiv,innerDiv2);
    var outterDiv2=$('<div>',{
        class:"modal-dialog"
    });
    outterDiv2.append(midDiv);
    var outterDiv=$('<div>',{
        class:"modal fade",
        id:"genModal",
        role:"dialog"
    });
    // outterDiv.append(outterDiv2);
    $('thead').append(outterDiv.append(outterDiv2));
}
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form//calls clearAddStudentForm eh
 */
function cancelClicked(){
    clearAddStudentForm();
}
/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(name,grades,courses){
    var newObject = {
        name: name,
        grade: grades,
        course: courses,
    };
    studentArray.push(newObject);
    sendStudent(newObject);
    updateData();
    return undefined;
};
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){
    $('#studentName').val("");
    $('#studentGrade').val("");
    $('#course').val("");
}
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number} /////////all the Joes need to be sought and matched and then averaged
 */
function calculateAverage(){
    var number = 0;
    for (var i=0;i<=studentArray.length-1;i++){
        number += parseFloat(studentArray[i].grade);
    }
    console.log(typeof number);
    return (number/studentArray.length).toFixed(2)+'%';
}
/**
 * updateData - centralized function to update the average and call student list update // prob wanna call updateAvg
 */
function updateData(){
    var result = calculateAverage();
    $('.avgGrade').html(result);
}
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */ //this one calls addStudent, it cycles thru the list for new student, calls addStudent2Dom, adds to Dom...studentLsit knows how many students need to be added eh
function updateStudentList(){
    var obj = studentArray[studentArray.length-1];
    addStudentToDom(obj);
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj){
    var newTableRow = $('<tr>');
    var tempStudentName = studentObj.name;
    var tempStudentCourse= studentObj.course_name || studentObj.course;
    var tempStudentGrade= studentObj.grade;
    var newCol1 = $('<td>').html(tempStudentName);
    var newCol2 = $('<td>').html(tempStudentCourse);
    var newCol3 = $('<td>').html(tempStudentGrade);
    var action = $('<td>');
    var delBtn = $('<button>',{
        class: "btn btn-danger",
        type: "button",
        text: "Delete"
    }).click(deleteClicked);
    var editBtn = $('<button>',{
        class:"btn btn-info",
        type: "button",
        text: "Update"
    }).click(updateStudent);
    //   var newCol4 = $('<td>').html(delBtn,editBtn);
    newTableRow.append(newCol1,newCol2,newCol3,action.append(delBtn,editBtn));
    $('tbody').append(newTableRow);
}
function deleteClicked(){
    var studentIndex = $(this).parent().parent().index();
    var studentID = studentArray[studentIndex]["id"];
    $(this).parent().parent().remove();
    studentArray.splice(studentIndex, 1);
    // $(this).parent('tr').remove();
    updateData();
    removeStudent(studentID)
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset(){
    studentArray=[];
    // $('tr>td').remove();
}

var global_response=null;
function dataResponse() {
    reset();
    $.ajax({
        dataType: 'json',
        url: '../prototypes_C2.17/php_SGTserver/data.php?action=readAll',
        method: 'post',
        success: function(response) {
            console.log("success",response);
            global_response = response;
            for (var i=0; i< global_response['data'].length;i++){
                studentArray.push(global_response['data'][i]);
                addStudentToDom(global_response['data'][i]);
                updateData();
            }
        },
        error: function(err){
            console.warn('REKT ', err);
        }
    })
}
function sendStudent(obj){
    var dataObject={
        'name': studentArray[studentArray.length-1]['name'],
        'course_name': studentArray[studentArray.length-1]['course'],
        'grade': studentArray[studentArray.length-1]['grade'],
    };
    $.ajax({
        data:dataObject,
        dataType: 'json',
        url: '../prototypes_C2.17/php_SGTserver/data.php?action=insert',
        method: 'POST',
        success: function(response){
            if (response.success === true){
                console.log(response);
                //studentArray[studentArray.length-1][id]=response['data'][id];
            }
        },
        error: function(response){
            console.log('err',response);
        }
    })
}
function removeStudent(id){
    var myData ={
        'id': id
    };
    $.ajax({
        data: myData,
        dataType: 'json',
        url: '../prototypes_C2.17/php_SGTserver/data.php?action=delete',
        method: 'POST',
        success: function(response){
            if (response.success===true){
                console.log(response+" removed");
            }
        },
        error: function(response){
            console.log('failed ', response);
        }
    })
}
function updateStudent() {
    var studentIndex = $(this).parent().parent().index();
    var studentID = studentArray[studentIndex]["id"];
    modalDisplay(studentID);
}
function modalDisplay(s){
    $('#myModal').modal($('#uID').val(s));
}
function updateStudentInfo() {
    var uName = $('#upName').val();
    var uGrade = $('#upGrade').val();
    var uCourse = $('#upCourse').val();
    var updateObject = {
        id: $('#uID').val(),
        student: uName,
        score: uGrade,
        course: uCourse
    };
    console.log('not ajax ',updateObject);
    updateStudentDom(updateObject);
    $('#updateForm input').val('');
    $("#myModal").modal('hide');
};
function updateStudentDom(d){
    var dataObject={
        'id': d['id'],
        'student': d['student'],
        'course': d['course'],
        'score': d['score'],
    };
    console.log('ajax ', dataObject);
    $.ajax({
        data:dataObject,
        dataType:'json',
        url: '../prototypes_C2.17/php_SGTserver/data.php?action=update',
        method: 'POST',
        success: function(response){
            console.log('updated');
        },
    });
};
