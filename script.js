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
// var inputIds=[
//     var studentName =$('#studentName').val(),
//     var studentGrade= $('#studentGrade').val(),
//     var studentCours e= $('#course').val()
//     ]
var inputIds=['studentName','studentCourse','studentGrade'];
/**
 * addClicked - Event Handler when user clicks the add button // function is executed when add button is clicked..it will call addStudent and UpdatetudentList will also call clearAddStudentFOrm
 */
function addClicked(){
    addStudent();
    updateStudentList();
    clearAddStudentForm();
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
    name=$('#studentName').val();
    grades = $('#studentGrade').val();
    courses = $('#course').val();
    var newObject ={
        name: name,
        grade: grades,
        course: courses

    };
    studentArray.push(newObject);
    sendStudent(newObject);
    updateData();

    return undefined;
}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){
    $('#studentName').val("");
    $('#studentGrade').val("");
    $('#course').val("");
    // $('#studentForm').reset();
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
    return parseFloat(number/studentArray.length).toFixed(2);
}
/**
 * updateData - centralized function to update the average and call student list update // prob wanna call updateAvg
 */
function updateData(){
    var result = calculateAverage();
    $('.avgGrade').html(result);
    // updateStudentList();
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
        var tempStudentCourse= studentObj.course;
        var tempStudentGrade= studentObj.grade;
    var newCol1 = $('<td>').html(tempStudentName);
    var newCol2 = $('<td>').html(tempStudentCourse);
    var newCol3 = $('<td>').html(tempStudentGrade);
    var delBtn = $('<button>',{
        class: "btn btn-danger",
        type: "button",
        text: "Delete"
    }).click(deleteClicked);
    var newCol4 = $('<td>').html(delBtn);
    newTableRow.append(newCol1,newCol2,newCol3,newCol4);
    $('.student-list-container tbody').append(newTableRow);
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
    // inputIds = null;
    // clearAddStudentForm();
    // location.reload();
}

/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(initializeSGT);
function initializeSGT(){
    $('.studentAdd').click(addClicked);
    $('.cancel').click(cancelClicked);
    $('.loadIt').click(dataResponse)
    reset();
}
var global_response;
function dataResponse() {
    var theData = {api_key: "QYMNIeNPIJ"};
    $.ajax({
        data: theData,
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        method: 'POST',
        success: function (response) {
            global_response = response;
            console.log(global_response.data);
            for (var i=0; i<=global_response.data.length-1;i++){
                studentArray.push(global_response.data[i]);
                addStudentToDom(studentArray[i]);
                updateData();
                //calculate the avg

            }
        }
    })
}
function sendStudent(obj){
    var myData= {api_key: "QYMNIeNPIJ"};
    myData.name = obj.name;
    myData.grade = obj.grade;
    myData.course = obj.course;
    $.ajax({
        data:myData,
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        method: 'POST',
        success: function(response){
            if (response.success === true){
                console.log(response);
                obj.id = response.new_id;

            }
        }
    })
}
function removeStudent(id){
    var myData = {api_key: "QYMNIeNPIJ"};
    myData.id = id;
    $.ajax({
        data: myData,
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/delete',
        method: 'POST',
        success: function(response){
            if (response.success===true){
                console.log(response+" removed");
            }

        },
        error: function(response){
            console.log(response);
        }
    })
}
