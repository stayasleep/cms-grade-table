<?php
//write a query that selects all the students from the database, all the data from each row
$query = "SELECT * FROM `student_data`";
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn,$query);
//print_r($result);

//check if $result is empty.
if(empty($result)){
    $output['error'][]='database error';
}else{
    //check if any data came back
    //$output['data']=[];
    //if it did, change output success to true
    //do a while loop to collect all the data
    if(mysqli_num_rows($result)>0){
       // print 'more than 0 rows';
        $output['success'] = true;
       // $output['data']=[];
        while($row =mysqli_fetch_assoc($result)){
            $output['data'][]=$row;
        }
    }else{
        $output['errors']=['no data'];
    }
}
?>