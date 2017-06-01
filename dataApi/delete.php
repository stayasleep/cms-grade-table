<?php
/*check connection*/
if (mysqli_connect_errno()){
    printf("Connect failed: %s\n",mysqli_connect_error());
    exit();
}
//check if you have all the data you need from the client-side call.
$id=$_POST['id'];
//if not, add an appropriate error to errors
if(empty($id)) {
    $output['errors'][] = "Missing ID";
}else {
    //write a query that deletes the student by the given student ID
    //escape id first
    $id=mysqli_real_escape_string($conn,$id);

    $query = "DELETE FROM  `student_data` WHERE `id`='$id'";
    $result = mysqli_query($conn, $query);
    //send the query to the database, store the result of the query into $result
    //check if $result is empty.
    if (empty($result)) {
        //if it is, add 'database error' to errors
        $output['errors'][] = 'database error';
    } else {
        if (mysqli_affected_rows($conn) === 1) {
            $output['success'] = true;
        } else {
            $output['errors'][] = 'delete error';
        }
    }
}
mysqli_close($conn);
?>