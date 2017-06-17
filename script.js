/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var studentArray=[];
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(initializeSGT);

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
    $('#myModal').on('hidden.bs.modal',function(){
        $('.uSubmitError, .uGError, .uCError, .uNError').html("");
    });
    $('#filterName').on('keyup',filterByName);
    reset();
}
function validation(paramClass){
    var nameVal = $('#studentName').val() || $('#upName').val();
    //check whitespace
    if(nameVal && /(^\s+)([^a-zA-Z]+)/g.test(nameVal)){
        var output='<div class="alert alert-danger"><i class="fa fa-lg  fa-times-circle"></i> Please Remove Any Blank Spaces Before Entering A Name</div>';
        $(paramClass).html(output);
    }else{
        if(nameVal && !/^[A-z0-9 ]{3,30}$/g.test(nameVal)){
            if(nameVal.length<=2) {
                //so name is too short
                var output = '<div class="alert alert-danger">Names must contain at least 3 letters.</div>';
                $(paramClass).html(output);
            }else{
                //so name is too long
                var output = '<div class="alert alert-danger">Names must be under 30 character.</div>';
                $(paramClass).html(output);
            }
        }else{
            $(paramClass).html("");
        }
    }
}
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
 * addClicked - Event Handler when user clicks the add button // function is executed when add button is clicked..it will call addStudent and UpdatetudentList will also call clearAddStudentFOrm
 */
function addClicked(){
    var name=$('#studentName').val();
    var grades = $('#studentGrade').val();
    var courses = $('#course').val();
    if(name==="" || grades==="" || courses===""){
        // $('#genModal').show("hide");
        //$("#genModal").remove();
        generalModal("Please fill in all the required fields","Close","");
        $('#genModal').modal({keyboard:true});
        return false;
    }else {
        if($('.sError').html()==="" && $('.cError').html()==="" && $('.gError').html()===""){
            //$('#genModal').remove();
            addStudent(name,grades,courses);
            updateStudentList();
            clearAddStudentForm();
        }else{
            //$('#genModal').remove();
            generalModal("Please Fill In The Fields In The Proper Format","Close","");
            $('#genModal').modal({keyboard:true});
            return false;
        }
    }
}
function generalModal(str,str2,str3){
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
    var midDiv = $('<div>',{
        class:"modal-content modC"
    });
    midDiv.append(innerDiv,innerDiv2);
    var outterDiv2=$('<div>',{
        class:"modal-dialog"
    });
    outterDiv2.append(midDiv);
    var outterDiv=$('<div>',{
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
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form//calls clearAddStudentForm eh
 */
function cancelClicked(){
    clearAddStudentForm();
    $('.sError, .cError, .gError').html("");
    $('.serverResp').html("");
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
 * @returns {number}
 */
function calculateAverage(){
    var numbers = 0;
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
 * updateData - centralized function to update the average and call student list update // prob wanna call updateAvg
 */
function updateData(){
    var result = calculateAverage();
    $('.avgGrade').html(result);
}
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
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
    var newCol1 = $('<td>').text(tempStudentName);
    var newCol2 = $('<td>').text(tempStudentCourse);
    var newCol3 = $('<td>').text(tempStudentGrade);
    var action = $('<td>');
    var delBtn = $('<button>',{
        class: "btn btn-danger btnOps",
        type: "button",
        html:"<span>Delete</span>"
    }).click(deleteClicked);
    var editBtn = $('<button>',{
        class:"btn btn-info btnOps",
        type: "button",
        html:"<span>Update</span>"
    }).click(updateStudent);
    newTableRow.append(newCol1,newCol2,newCol3,action.append(delBtn,editBtn));
    $('tbody').append(newTableRow);
}
function deleteClicked(){
    $('#genModal').remove();
    var studentIndex = $(this).parent().parent().index();
    var studentID = studentArray[studentIndex]["id"];
    var deletedName = studentArray[studentIndex]["name"];
    var deletedStudent={"id":studentID,"deletedName":deletedName};
    var delRow = $(this);
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
        // $("#genModal").modal('hide');

    });
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset(){
    $('.serverResp').html("");
    studentArray=[];
    $('tbody>tr').remove();
}

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
                for (var i = 0; i < response['data'].length; i++) {
                    studentArray.push(response['data'][i]);
                    addStudentToDom(response['data'][i]);
                    updateData();
                }
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
    var output = '<div class="alert alert-info">Retrieving student entries...</div>';
    $('.serverResp').html(output);
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
    var output = "<div class='alert alert-info'> Adding"+dataObject.name+" to your records...</div>";
    $('.serverResp').html(output);
}
function removeStudent(obj){
    var myData ={
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
    var output = "<div class='alert alert-info'> Deleting "+obj.deletedName+" from your records...</div>";
    $('.serverResp').html(output);
}
function updateStudent() {
    $('.sError, .gError, .cError').html("");
    $('#studentName, #course, #studentGrade').val("");
    var studentIndex = $(this).parent().parent().index();
    //var studentID = studentArray[studentIndex]["id"];
    var studentUpdate = studentArray[studentIndex];
    //modalDisplay(studentID);
    modalDisplay(studentUpdate);
}
function modalDisplay(s){
    $('#upName').val(s.name);
    $('#upGrade').val(s.grade);
    $('#upCourse').val(s.course_name);
    $('#myModal').modal($('#uID').val(s.id));
}
function updateStudentInfo() {
    var uName = $('#upName').val();
    var uGrade = $('#upGrade').val();
    var uCourse = $('#upCourse').val();
    if(uName === "" || uGrade === "" || uCourse === ""){
        var output = "<div class='alert alert-danger'>Please Fill In All The Required Fields.</div>";
        $('.uSubmitError').html(output);
        return false;
    }
    var updateObject = {
        id: $('#uID').val(),
        student: uName,
        score: uGrade,
        course: uCourse
    };
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
    var output = "<div class='alert alert-info'> Updating your record...</div>";
    $('.serverResp').html(output);
};

function submitWithKeys(){
        if((e.which === 13 || e.keyCode ===13) || (e.which ===27 || e.keyCode ===27)){
            $("#genModal").remove();
        }
}
//A filter?
//take the value being typed into it and start doing ajax calls when you type
function filterByName(){
    reset();
    var filteredName = $('#filterName').val();
    $.ajax({
        data: {"name":filteredName},
        dataType:"json",
        url: 'data.php?action=filter',
        method: "POST",
        success:function(response){
            console.log('this is my response',response);
            if(response.success){
                $('.serverResp').html("");
                for (var j=0;j<response.data.length;j++){
                    studentArray.push(response.data[j]);
                    addStudentToDom(response.data[j]);
                    updateData();
                }
            }else if(response.errors[0] === "Missing Name"){
                //Field is empty after backspacing
                dataResponse();
            }else{
                $('.serverResp').html("");
                var output = "<div class='alert alert-danger'>There are no names that match</div>";
                $('.serverResp').html(output);
            }
        },
        error: function(response){
            $('.serverResp').html("");
            generalModal("There is a problem with the connection.  Please try again later","Close","");
            $('#genModal').modal({keyboard:true});
        }
    });
    var output = "<div class='alert alert-info'> Filtering...</div>";
    $('.serverResp').html(output);
}