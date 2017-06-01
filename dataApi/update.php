<?php
/*check connection*/
if (mysqli_connect_errno()){
    printf("Connect failed: %s\n",mysqli_connect_error());
    exit();
}
//check if you have all the data you need from the client-side call.  This should include the fields being changed and the ID of the student to be changed
$id=$_POST['id'];
$updateFields = [
    'student' => 'name',
    'course'=>'course_name',
    'score'=>'grade'
];
//if not, add an appropriate error to errors
if(empty($id)){
    $output['errors'][]='Missing ID';
}else{
    $query = "UPDATE `student_data` SET ";
    foreach($updateFields as $externalField => $internalField){
        if(!empty($_POST[$externalField])){
            $query.="`$internalField`='{$_POST[$externalField]}', ";
        }
    }
    $query = substr($query,0,-2);
    $query.=" WHERE id=$id";
    //send the query to the database, store the result of the query into $result
    $result = mysqli_query($conn,$query);
    //check if $result is empty.
    if(empty($result)) {
        //if it is, add 'database error' to errors
        $output['errors'][] = 'database error';
    }else{
        //check if the number of affected rows is 1.  Please note that if the data updated is EXCACTLY the same as the original data, it will show a result of 0
        //if it did, change output success to true
        if(mysqli_affected_rows($conn) === 1){
            $output['success']=true;
        }else{
            //if not, add to the errors: 'update error'
            $output['errors'][] = 'update error';
        }
    }
}
mysqli_close($conn);
?>