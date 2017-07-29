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
$grade = ltrim($grade, '0');

if (filter_var($grade, FILTER_VALIDATE_INT, array("options" => array("min_range"=>$min, "max_range"=>$max))) === false) {
    $output['errors'][]="Variable value is not within the legal range 1 - 100";
}
$course_name =  filter_var($course_name, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);

//escape vars if theyre not empty
$name = mysqli_real_escape_string($conn, $name);
$grade = mysqli_real_escape_string($conn, $grade);
$course_name = mysqli_real_escape_string($conn, $course_name);

if(count($output['errors'])===0){

    $query="INSERT INTO `student_data` (`name`,`grade`,`course_name`) VALUES (?,?,?) ";
    //prepare statement
    if($stmt = $conn-> prepare($query)){
        //bind variables for placeholder
        $stmt->bind_param("sss",$name,$grade,$course_name);
        //execute statement
        $stmt->execute();

        //check results of action
        if(empty($stmt->affected_rows)){
            $output['errors'][]='database error';
        }else{
            if($stmt->affected_rows===1){
                $output['success']=true;
                $insertID = $stmt->insert_id;
                $output['insertID']=$insertID;
            }else{
                $output['errors'][]='insert error';
            }
        }
        //close statement
        $stmt->close();
    }

}
//close connection
$conn->close();
?>
