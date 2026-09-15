<?php
header("Content-Type: application/json");
$file=__DIR__."/products.json";
if(file_exists($file)){echo file_get_contents($file);}
else{http_response_code(404);echo json_encode(["error"=>"Product data not found."]);}
?>