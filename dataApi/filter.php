<?php
/*check connection*/
if (mysqli_connect_errno()){
    printf("Connect failed: %s\n",mysqli_connect_error());
    exit();
}
//check if you have all the data from the client side call
$name = $_POST['name'];

//perform some validation on the client input
if(empty($name)){
    $output['errors'][]="Missing Name";
}

$name = filter_var($name, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);

$name = addslashes($name);

//escape vars if theyre not empty
$name = mysqli_real_escape_string($conn, $name);


//proceed if no error
if(count($output['errors'])===0) {
    //query template
    $query = "SELECT `id`,`name`,`grade`,`course_name` FROM `student_data` WHERE `name` LIKE ? ";
    //prepare statement
    if ($stmt = $conn->prepare($query)) {

        $name = "%" . $name . "%";
        $stmt->bind_param("s", $name);
        //execute statement
        if (!$stmt->execute()) {
            $output['errors'][] = 'prepared stmt fail';
        }

        if (!$stmt->bind_result($resultID, $resultName, $resultGrade, $resultCourse)) {
            $output['errors'][] = "Binding output params failed(" . $stmt->errno . ")" . $stmt->error;
        }

        //check results of action
        if (empty($stmt->affected_rows)) {
            $output['errors'][] = 'database error';
        } else {
            $output['data'] = [];
            while ($stmt->fetch()) {
                $row = array("name" => $resultName, "id" => $resultID, "course_name" => $resultCourse, "grade" => $resultGrade);
                $output['data'][] = $row;
            }
            if (count($output['data']) === 0) {
                $output['errors'] = ['no data'];
            } else {
                $output['success'] = true;
            }
        }
        $stmt->close();
    }
}
//close connection
$conn->close();
?>