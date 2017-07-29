/**
 * @name -student_array
 * @description - global array to hold student objects
 * @type {Array}
 */
var studentArray=[];
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(initializeSGT);

/**
 * @name - initializeSGT
 * @description - initializes event handlers and functions for the modal
 * */
function initializeSGT(){
    $('.studentAdd').click(addClicked);
    $('.cancel').click(cancelClicked);
    dataResponse();
    $('.upbtn').click(updateStudentInfo);
    $('.modC').keypress(submitWithKeys);
    $('#studentName').blur(function(){
        validation('.sError');
    });
    $('#upName').blur(function(){
        validation('.uNError');
    });
    $('#course').blur(function(){
        validation2('.cError');
    });
    $('#upCourse').blur(function(){
        validation2('.uCError');
    });
    $('#studentGrade').blur(function(){
        validation3('.gError');
    });
    $('#upGrade').blur(function(){
        validation3('.uGError');
    });
    $('input').focus(function(){
        $('.serverResp').html("");
    });
    $('#updateModal').on('hidden.bs.modal',function(){
        $('.uSubmitError, .uGError, .uCError, .uNError').html("");
    });
    $('#filterName').on('keyup',filterByName);
    reset();
}
/**
 * @name - validation
 * @description - Regex validation for the name input field.  Checks for blank spaces and whether or not the name is between
 * 3-30 characters.
 * @param paramClass
 * */
function validation(paramClass){
    var nameVal = $('#studentName').val() || $('#upName').val();
    //check whitespace
    if(nameVal && /(^\s+)([^a-zA-Z]+)/g.test(nameVal)){
        var output='<div class="alert alert-danger"><i class="fa fa-lg  fa-times-circle"></i> Please remove any blank spaces before entering a name.</div>';
        $(paramClass).html(output);
    }else{
        if(nameVal && !/^[A-z0-9 ]{3,30}$/g.test(nameVal)){
            if(nameVal.length<=2) {
                //so name is too short
                var output = '<div class="alert alert-danger">Names must contain at least 3 letters.</div>';
                $(paramClass).html(output);
            }else{
                //so name is too long
                var output = '<div class="alert alert-danger">Names must be under 30 character and no special characters.</div>';
                $(paramClass).html(output);
            }
        }else{
            $(paramClass).html("");
        }
    }
}
/**
 * @name - validation2
 * @description - Regex validation for the course input value.  Checks for blank spaces and the course value must be
 * between 2 - 40 characters
 * @param paramClass
 * */
function validation2(paramClass){
    var courseVal = $('#course').val() || $('#upCourse').val();
    if(courseVal  && /(^\s+)([^a-zA-Z]+)/g.test(courseVal)){
        var output = '<div class="alert alert-danger">Please Enter a Course Name</div>';
        $(paramClass).html(output);
    }else{
        if(courseVal && !/^([a-zA-Z0-9 :\-.'"]+){2,40}$/g.test(courseVal)){
            if(courseVal.length<=2) {
                //too short class name
                var output = '<div class="alert alert-danger">Course Name Must Be At Least 2 Characters</div>';
                $(paramClass).html(output);
            }else{
                //name is too long
                var output = '<div class="alert alert-danger">Course Name Must Be Shorter Than 40 Characters</div>';
                $(paramClass).html(output);
            }
        }else{
            $(paramClass).html("");
        }
    }
}
/**
 * @name - validation3
 * @description - Regex validation for the input grade value.  Alerts the user whether or not the number is between 1-100 and
 * is a whole number.
 * @param paramClass
 * */
function validation3(paramClass){
    var gradeVal = $('#studentGrade').val() || $('#upGrade').val();
    if(gradeVal && !/^0*(?:[1-9][0-9]?|100)$/g.test(gradeVal)){
        var output = '<div class="alert alert-danger">Please Enter a Whole Number Between 1-100</div>';
        $(paramClass).html(output);
    }else{
        if(gradeVal <= 1){
            var output = '<div class="alert a;ert-danger">Grade Must Be Greater Than 0</div>';
            $(paramClass).html(output);
        }
        $(paramClass).html("");
    }
}
/**
 * @name - addClicked
 * @description - Event Handler when user clicks the add button. It will call @addStudent and @updateStudentList and also @clearAddStudentForm
 * if there are no error divs present in the body.
 */
function addClicked(){
    let name=$('#studentName').val();
    let grades = $('#studentGrade').val();
    let courses = $('#course').val();
    if(name==="" || grades==="" || courses===""){
        generalModal("Please fill in all the required fields","Close","");
        $('#genModal').modal({keyboard:true});
        return false;
    }else {
        if($('.sError').html()==="" && $('.cError').html()==="" && $('.gError').html()===""){
            addStudent(name,grades,courses);
            updateStudentList();
            clearAddStudentForm();
        }else{
            generalModal("Please Fill In The Fields In The Proper Format","Close","");
            $('#genModal').modal({keyboard:true});
            return false;
        }
    }
}
/**
 * @name - generalModal
 * @description - dynamically creates a general use modal that will be used to convery confirmations or notices to the user depending
 * on the performed action.
 * @params - str, str2, str3
 * */
function generalModal(str,str2,str3){
    let innerDiv = $('<div>',{
        class:"modal-body"
    });
    let innerP=$('<p>',{
        class:"modal-str",
        text: str
    });
    innerDiv.append(innerP);
    let innerDiv2=$('<div>',{
        class:"modal-footer"
    });
    let innerBtnX=$('<button>',{
        type:"button",
        class:"btn btn-danger closer",
        "data-dismiss":"modal",
        html:"<span>"+str2+"</span>",
    });
    if(str3 !== ""){
        var innerBtnX2 = $('<button>',{
            type:"button",
            class:"btn btn-success confirmOp",
            "data-dismiss":"modal",
            html:"<span>"+str3+"</span>",
        });
        innerDiv2.append(innerBtnX2,innerBtnX);
    }else {
        innerDiv2.append(innerBtnX);
    }
    let midDiv = $('<div>',{
        class:"modal-content modC"
    });
    midDiv.append(innerDiv,innerDiv2);
    let outterDiv2=$('<div>',{
        class:"modal-dialog"
    });
    outterDiv2.append(midDiv);
    let outterDiv=$('<div>',{
        class:"modal fade ",
        id:"genModal",
        role:"dialog",
        tabindex:-1
    });
    $('thead').append(outterDiv.append(outterDiv2));
    $("#genModal").on('shown.bs.modal',function(){
        $('.closer').focus();
    });
    $('#genModal').on('hidden.bs.modal',function(){
        $('#genModal').remove();
    })
}
/**
 * @name - cancelClicked
 * @description - Event Handler when user clicks the cancel button, should clear out student form//calls clearAddStudentForm.
 */
function cancelClicked(){
    clearAddStudentForm();
    $('.sError, .cError, .gError').html("");
    $('.serverResp').html("");
}
/**
 * @name - addStudent
 * @description - creates a student objects based on input fields in the form and adds the object to global student array.
 * @params - name, grades, courses
 * @return undefined
 */
function addStudent(name,grades,courses){
    let newObject = {
        name: name,
        grade: grades,
        course: courses,
    };
    studentArray.push(newObject);
    sendStudent(newObject);
    updateData();
    // return undefined;
}
/**
 * @name - clearAddStudentForm
 * @description - clears out the form values based on inputIds variable.
 */
function clearAddStudentForm(){
    $('#studentName').val("");
    $('#studentGrade').val("");
    $('#course').val("");
}

/**
 * @name - calculateAverage
 * @description - loop through the global student array and calculate average grade and return that value.
 * @returns {number}
 */
function calculateAverage(){
    let numbers = 0;
    if(!studentArray.length){
        return 0+"%";
    }
    for (var i=0;i<=studentArray.length-1;i++){
        numbers += parseFloat(studentArray[i].grade);
    }
    var number = (numbers/studentArray.length).toFixed(2);
    if(number>=90.00){
        $(".avgGrade").css("background-color","green");
    }else if (number>=80.00){
        $(".avgGrade").css("background-color","mediumseagreen");
    }else if(number>=70.00){
        $(".avgGrade").css("background-color","orange");
    }else if(number>=60.00){
        $(".avgGrade").css("background-color","lightcoral");
    }else{
        $(".avgGrade").css("background-color","red");
    }
    return number+'%';
}
/**
 * @name - updateData
 * @description - centralized function to update the average and call student list update // call calculateAverage.
 */
function updateData(){
    let result = calculateAverage();
    $('.avgGrade').html(result);
}
/**
 * @name - updateStudentList
 * @description - loops through global student array and appends each objects data into the student-list-container > list-body.
 */
function updateStudentList(){
    let obj = studentArray[studentArray.length-1];
    addStudentToDom(obj);
}
/**
 * @name - addStudentToDom
 * @description - take in a student object, create html elements from the values and then append the elements.
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj){
    let newTableRow = $('<tr>');
    let tempStudentName = studentObj.name;
    let tempStudentCourse= studentObj.course_name || studentObj.course;
    let tempStudentGrade= studentObj.grade;
    let newCol1 = $('<td>').text(tempStudentName);
    let newCol2 = $('<td>').text(tempStudentCourse);
    let newCol3 = $('<td>').text(tempStudentGrade);
    let action = $('<td>');
    let delBtn = $('<button>',{
        class: "btn btn-danger btnOps",
        type: "button",
        html:"<span>Delete</span>"
    }).click(deleteClicked);
    let editBtn = $('<button>',{
        class:"btn btn-info btnOps",
        type: "button",
        html:"<span>Update</span>"
    }).click(updateStudent);
    newTableRow.append(newCol1,newCol2,newCol3,action.append(delBtn,editBtn));
    $('tbody').append(newTableRow);
}
/**
 * @name - deleteClicked
 * @description - Locate the index for the record that was clicked on.  Then, use the index value
 * as the position in the studentArray to find the object's id value.  Bring up confirmation modal
 * before sending the id to the @removeStudent ajax call.
 * */
function deleteClicked(){
    $('#genModal').remove();
    let studentIndex = $(this).parent().parent().index();
    let studentID = studentArray[studentIndex]["id"];
    let deletedName = studentArray[studentIndex]["name"];
    let deletedStudent={"id":studentID,"deletedName":deletedName};
    let delRow = $(this);
    generalModal("Please confirm entry before deleting","Cancel","Confirm");
    $('#genModal').modal();
    $('.confirmOp').click(function(){
        delRow.parent().parent().remove();
        studentArray.splice(studentIndex,1);
        updateData();
        removeStudent(deletedStudent);
        if(studentArray.length === 0){
            $('#filterName').attr("disabled","disabled");
        }
    });
}
/**
 * @name - reset
 * @description - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset(){
    $('.serverResp').html("");
    studentArray=[];
    $('tbody>tr').remove();
}

/**
 * @name - dataResponse
 * @description - Ajax call that returns the rows from the database and appends the results onto
 * the screen by sending it off to the next function, @addStudentToDom.  Displays error
 * messages if there are no entries to return or the connection is broken.
 * */
function dataResponse() {
    reset();
    $.ajax({
        dataType: 'json',
        url: 'data.php?action=readAll',
        method: 'post',
        success: function(response) {
            if(response.success) {
                $('.serverResp').html("");
                $('#filterName').removeAttr("disabled");
                response.data.forEach(function(entry){
                    studentArray.push(entry);
                    addStudentToDom(entry);
                    updateData();
                });
            }else{
                $('.serverResp').html("");
                $('#filterName').attr("disabled","disabled");
                generalModal("There are no entries in your database yet; please fill out the form to add entries.","Close","");
                $('#genModal').modal({keyboard:true});
            }
        },
        error: function(response){
            $('.serverResp').html("");
            generalModal("There is a problem with the connection.  Please try again later","Close","");
            $('#genModal').modal({keyboard:true});
        }
    });
    let output = '<div class="alert alert-info">Retrieving student entries...</div>';
    $('.serverResp').html(output);
}

/**
 * @name - sendStudent
 * @description - sends a new object to add to the database containing student information.
 * On success, updates the DOM; otherwise, displays appropriate error message.
 * */
function sendStudent(obj){
    let dataObject={
        'name': studentArray[studentArray.length-1]['name'],
        'course_name': studentArray[studentArray.length-1]['course'],
        'grade': studentArray[studentArray.length-1]['grade'],
    };
    $.ajax({
        data:dataObject,
        dataType: 'json',
        url: 'data.php?action=insert',
        method: 'POST',
        success: function(response){
            $('.serverResp').html("");
            if (response.success === true){
                var output = "<div class='alert alert-success'> Successfully Added "+dataObject.name+" to your records.</div>";
                $('.serverResp').html(output);
                dataResponse();
                //studentArray[studentArray.length-1][id]=response['data'][id];
            }else{
                generalModal("Unable to insert entry into your records; please fill out the form in the proper format and try again.","Close","");
                $('#genModal').modal({keyboard:true});
            }
        },
        error: function(response){
            $('.serverResp').html("");
            generalModal("There is a problem with the connection.  Please try again later","Close","");
            $('#genModal').modal({keyboard:true});
        }
    });
    let output = "<div class='alert alert-info'> Adding"+dataObject.name+" to your records...</div>";
    $('.serverResp').html(output);
}

/**
 * @name - removeStudent
 * @description - Ajax call to remove the record from the database and update the DOM to reflect any changes.
 * */
function removeStudent(obj){
    let myData ={
        'id': obj.id
    };
    $.ajax({
        data: myData,
        dataType: 'json',
        url: 'data.php?action=delete',
        method: 'POST',
        success: function(response){
            $('.serverResp').html("");
            if (response.success===true){
                var output = "<div class='alert alert-success'> Deleted "+obj.deletedName+" from your records.</div>";
                $('.serverResp').html(output);
            }else{
                generalModal("Unable to delete the  entry from your records; please try again.","Close","");
                $('#genModal').modal({keyboard:true});
            }
        },
        error: function(response){
            $('.serverResp').html("");
            generalModal("There is a problem with the connection, cannot remove the entry.  Please try again later.","Close","");
            $('#genModal').modal({keyboard:true});
        }
    });
    let output = "<div class='alert alert-info'> Deleting "+obj.deletedName+" from your records...</div>";
    $('.serverResp').html(output);
}

/**
 * @name - updateStudent
 * @description - Clear the error fields, locate the index value for the record that was clicked on the table
 * and then use that index to find the object's position within the global student array to populate the modal accordingly.
 * */
function updateStudent() {
    $('.sError, .gError, .cError').html("");
    $('#studentName, #course, #studentGrade').val("");
    let studentIndex = $(this).parent().parent().index();
    //var studentID = studentArray[studentIndex]["id"];
    let studentUpdate = studentArray[studentIndex];
    //modalDisplay(studentID);
    modalDisplay(studentUpdate);
}
/**
 * @name - modalDisplay
 * @description - Populates the update modal with the previous values for the record.
 * */
function modalDisplay(s){
    $('#upName').val(s.name);
    $('#upGrade').val(s.grade);
    $('#upCourse').val(s.course_name);
    $('#updatedModal').modal($('#uID').val(s.id));
}
/**
 * @name - updateStudentInfo
 * @description - Takes the updated data and packages it as an object before sending it to the appropriate Ajax call.
 * Afterwards, clear the form and close the modal before returning to the page.
 * */
function updateStudentInfo() {
    let uName = $('#upName').val();
    let uGrade = $('#upGrade').val();
    let uCourse = $('#upCourse').val();
    if(uName === "" || uGrade === "" || uCourse === ""){
        var output = "<div class='alert alert-danger'>Please Fill In All The Required Fields.</div>";
        $('.uSubmitError').html(output);
        return false;
    }
    let updateObject = {
        id: $('#uID').val(),
        student: uName,
        score: uGrade,
        course: uCourse
    };
    updateStudentDom(updateObject);
    $('#updateForm input').val('');
    $("#updatedModal").modal('hide');
}
/**
 * @name - updateStudentDom
 * @description - send student object to database with updated information for a particular record.
 * @returns on success, updates the DOM with new information ; otherwise, displays detailed error message.
 * */
function updateStudentDom(d){
    let dataObject={
        'id': d['id'],
        'student': d['student'],
        'course': d['course'],
        'score': d['score'],
    };
    $.ajax({
        data:dataObject,
        dataType:'json',
        url: 'data.php?action=update',
        method: 'POST',
        success: function(response){
            $('.serverResp').html("");
            if (response.success){
                var output = "<div class='alert alert-success'> Your record has successfully updated.</div>";
                $('.serverResp').html(output);
                dataResponse();
            }else{
                generalModal("Unable to update the  entry from your records; please fill in the fields in the proper format.","Close","");
                $('#genModal').modal({keyboard:true});
            }
        },
        error:function(response){
            $('.serverResp').html("");
            generalModal("There is a problem with the connection.  Please try again later","Close","");
            $('#genModal').modal({keyboard:true});
        }
    });
    let output = "<div class='alert alert-info'> Updating your record...</div>";
    $('.serverResp').html(output);
}

/**
 * @name - submitWithKeys
 * @description - When certain modals are open, allows it to be closed with esc or enter key
 * */
function submitWithKeys(){
        if((e.which === 13 || e.keyCode ===13) || (e.which ===27 || e.keyCode ===27)){
            $("#genModal").remove();
        }
}

/**
 * @name - filterByName
 * @description - creates a call to the database based on matching input values
 * with a setTimeout to give the user a chance to type
 * @returns database results if successful, otherwise appends error message
 * */
function filterByName(){
    setTimeout(function() {
        // reset();
        let filteredName = $('#filterName').val();
        $.ajax({
            data: {"name": filteredName},
            dataType: "json",
            url: 'data.php?action=filter',
            method: "POST",
            success: function (response) {
                reset();
                console.log('filtered resp',response);
                if (response.success) {
                    $('.serverResp').html("");
                    for (let j = 0; j < response.data.length; j++) {
                        studentArray.push(response.data[j]);
                        addStudentToDom(response.data[j]);
                        updateData();
                    }
                } else if (response.errors[0] === "Missing Name") {
                    //Field is empty after backspacing
                    dataResponse();
                } else {
                    $('.serverResp').html("");
                    let filterBy = $('#filterName').val();
                    filterBy = filterBy.replace(/<|>/ig, function (m) {
                        return '&' + (m == '>' ? 'g' : 'l') + 't;';
                    });
                    var output = "<div class='alert alert-danger'>We&apos;re sorry, there are 0 matches for " + filterBy + ". </div>";
                    $('.serverResp').html(output);
                }
            },
            error: function (response) {
                $('.serverResp').html("");
                generalModal("There is a problem with the connection.  Please try again later", "Close", "");
                $('#genModal').modal({keyboard: true});
            }
        });
        let output = "<div class='alert alert-info'> Filtering...</div>";
        $('.serverResp').html(output);
    },1000);
}