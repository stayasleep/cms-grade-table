<?php
/*check connection*/
if (mysqli_connect_errno()){
    printf("Connect failed: %s\n",mysqli_connect_error());
    exit();
}

//check if you have all the data you need from the client-side call.
$name=$_POST['name'];
$grade=$_POST['grade'];
$course_name=$_POST['course_name'];
//if not, add an appropriate error to errors
if(empty($name)){
    $output['errors'][]='Missing Name';
}
if(empty($grade)){
    $output['errors'][]='Missing Grade';
}
if(empty($course_name)){
    $output['errors'][]='Missing Course Name';
}
//Sanitize this data
$name = filter_var($name, FILTER_SANITIZE_STRING,  FILTER_FLAG_STRIP_HIGH);
$min = 0;
$max = 100;
if (filter_var($grade, FILTER_VALIDATE_INT, array("options" => array("min_range"=>$min, "max_range"=>$max))) === false) {
    $output['errors'][]="Variable value is not within the legal range 0 - 100";
}
$course_name =  filter_var($course_name, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);

//escape vars if theyre not empty
$name = mysqli_real_escape_string($conn, $name);
$grade = mysqli_real_escape_string($conn, $grade);
$course_name = mysqli_real_escape_string($conn, $course_name);

if(count($output['errors'])===0){
    //write a query that inserts the data into the database.  remember that ID doesn't need to be set as it is auto incrementing
    $query = "INSERT INTO `student_data`(`id`, `name`, `grade`, `course_name`) VALUES (null,'$name','$grade','$course_name')";
//send the query to the database, store the result of the query into $result
    $result=mysqli_query($conn,$query);
//check if $result is empty.
    if(empty($result)) {
        //if it is, add 'database error' to errors
        $output['errors'][] = 'database error';
    }else{
        if(mysqli_affected_rows($conn) === 1){
            $output['success']=true;
            $insertID=mysqli_insert_id($conn);
            $output['insertID']=$insertID;
        }else{
            $output['errors'][]='insert error';
        }
    }
}

mysqli_close($conn);
?>
