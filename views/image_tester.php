<?php
    header('Content-type:text/html;charset=utf-8');
    $base64_image_content = $_POST['imgBase64'];
    //匹配出图片的格式
    if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image_content, $result)){
        $type = $result[2];
        $path = "upload/";
        if(!file_exists($path))
        {
            //检查是否有该文件夹，如果没有就创建，并给予最高权限
            mkdir($path, 0700);
        }
        $new_file = $path . time() . ".{$type}";
        if (file_put_contents($new_file, base64_decode(str_replace($result[1], '', $base64_image_content)))){
            echo '保存成功：', $new_file;
        } else {
            echo '保存失败';
        }
    }