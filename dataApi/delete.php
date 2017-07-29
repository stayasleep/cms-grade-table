<?php
/*check connection*/
if (mysqli_connect_errno()){
    printf("Connect failed: %s\n",mysqli_connect_error());
    exit();
}
//check if you have all the data you need from the client-side call.
$id=$_POST['id'];
//escape vars
$min = 0;
$max = 1000;
if (filter_var($id, FILTER_VALIDATE_INT, array("options" => array("min_range"=>$min, "max_range"=>$max))) === false) {
    $output['errors'][]="Invalid ID Type";
}


//if not, add an appropriate error to errors
if(empty($id)) {
    $output['errors'][] = "Missing ID";
}else {
    //write a query that deletes the student by the given student ID
    $id=mysqli_real_escape_string($conn,$id);

    //query template
    $query="DELETE FROM `student_data` WHERE `id`= ?";
    //prepare statement
    if($stmt = $conn->prepare($query)){
        //bind vars for placeholder
        $stmt->bind_param("s",$id);
        //execute statement
        $stmt->execute();
        //check to see if result is empty
        if(empty($stmt->affected_rows)){
            $output['errors'][]='database error';
        }else{
            if($stmt->affected_rows===1){
                $output['success']=true;
            }else{
                $output['errors'][]='delete error';
            }
        }
    }
    //close
    $stmt->close();
}
//close connection
$conn->close();
//mysqli_close($conn);
?>