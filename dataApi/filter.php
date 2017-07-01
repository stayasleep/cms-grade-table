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


//proceed if no erro
if(count($output['errors'])===0){
    $query = "SELECT * FROM `student_data` WHERE `name` LIKE '%".$name."%'";
    $result = mysqli_query($conn,$query);

    //if there is no match
    if(empty($result)){
        $output['errors'][]='database error';
    }else{
        if(mysqli_num_rows($result)>0){
            $output['success']=true;
            while ($row = mysqli_fetch_assoc($result)){
                $output['data'][]=$row;
            }
        }else{
            $output['errors']=['no data'];
        }
    }
}
mysqli_close($conn);
?>