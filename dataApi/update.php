<?php
/*check connection*/
if (mysqli_connect_errno()){
    printf("Connect failed: %s\n",mysqli_connect_error());
    exit();
}
//check if you have all the data you need from the client-side call.  This should include the fields being changed and the ID of the student to be changed
$id=$_POST['id'];
if(empty($id)){
    $output['errors'][]='Missing ID';
}
if (!filter_var($id, FILTER_VALIDATE_INT)) {
    $output['errors'][]="Invalid ID Type";
}

$min = 0;
$max = 100;
if (filter_var($_POST['score'], FILTER_VALIDATE_INT, array("options" => array("min_range"=>$min, "max_range"=>$max))) === false) {
    $output['errors'][]="Grade value is not within the legal range";
}
$updateFields = [
    'student' => 'name',
    'course'=>'course_name',
    'score'=>'grade'
];
//check to see if there are any errors so far, if not then perform mysql query
if(count($output['errors'])!==0){
    $output['errors'][]='There is a problem with your request';
} else{
    $query = "UPDATE `student_data` SET ";
    foreach($updateFields as $externalField => $internalField){
        if(!empty($_POST[$externalField])){
            echo $_POST[$externalField];
            $newstr = filter_var($_POST[$externalField], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
            $query.="`$internalField`='{$newstr}', ";
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