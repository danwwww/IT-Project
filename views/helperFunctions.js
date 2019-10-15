function deleteItem(itemName){
    console.log("helper function: delete item called");
    console.log("itemName:", itemName);
    if(confirm("Are you sure to delete this item?")){
        var xhr = new XMLHttpRequest();
        xhr.open("delete","deleteItem"+itemName,true);
        xhr.onload = function(){
            var items = JSON.parse(xhr.responseText);
            if(xhr.readyState ==4 && xhr.status == "200"){
                console.table(items);
                window.location.href("artifact_test.jade", items);

            }else{
                console.error(items);
            }
        }
        xhr.send(null);
    }
}