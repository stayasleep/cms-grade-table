<?php
if (mysqli_connect_errno()){
    printf("Connect failed: %s\n",mysqli_connect_error());
    exit();
}
$id = $_POST['id'];
if (!ctype_digit($id)) {
    $output['errors'][] = "Please specify a student id";
    return;
}
if (ctype_space($_POST['student']) || ctype_space($_POST['course']) || ctype_space($_POST['score'])) {
    $output['errors'][] = 'No empty fields allowed';
}


$updateFields = [
    'student' => 'name',
    'course' => 'course_name',
    'score' => 'grade'
];
if (empty($id)) {
    $output['errors'][] = 'Missing ID';
}
else {

    $query = "UPDATE `student_data` SET ";
    foreach ($updateFields as $externalField => $internalField) {
        // if the fields are not empty, append the information to the query string
        if (!empty($_POST[$externalField])) {
            $slashedInput = addslashes($_POST[$externalField]);
            $query .= "`$internalField` = '{$slashedInput}',";
        } else {
            $output['errors'][] = "Missing ".$externalField;
        }
    }
    $query = substr($query, 0, -1);
    $query .= " WHERE `id`=$id";
    if (count($output['errors']) === 0) {
        $result = mysqli_query($conn, $query);
        if (empty($result)) {
            $output['errors'][] = 'database error';
        } else {
            if (mysqli_affected_rows($conn) === 1) {
                $output['success'] = true;
            } else if(mysqli_affected_rows($conn)===0){
                $output['success'] = true; //orly
            } else {
                $output['errors'][] = 'update error';
            }
        }
    }
}

?>
