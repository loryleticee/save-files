<?php
define(
    'IS_AJAX',
    (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHTTPREQUEST') || $_SERVER["REQUEST_METHOD"] == "POST"
);
if (!IS_AJAX) {
    die('Restricted access');
}

if (($file = $_FILES['file']['tmp_name'] ?? '') === '') {
    return_the_response("true", 'Aucun fichier n\'a été receptionné');
}

if (0 < $_FILES['file']['error']) {
    return_the_response("true", 'Erreur d\'upload');
}

$authorized_format_file = ["image/jpeg", "image/jpg",];
if (!in_array($_FILES['file']["type"], $authorized_format_file)) {
    return_the_response("true", 'Format invalide');
}

$folder_user = "img_" . ((string) rand(10000, 990000) . '_' . time());
while (is_dir($folder_user)) {
    $folder_user  = "img_" . ((string) rand(10000, 990000) . '_' . time());
}

if (!mkdir($folder_user, 0755)) {
    return_the_response('true', "Impossible de creer le dossier $folder_user");
}

if (!move_uploaded_file($_FILES['file']['tmp_name'], $folder_user . '/' . $_FILES['file']["name"])) {
    return_the_response('true', 'Convert with errors');
}

if (!exec("python3 sendMail.py", $output, $cde)) {
    return_the_response('true', "Python file execution failed");
}

function return_the_response(string $error = "false", string $message = ""): void
{
    print json_encode(['error' => $error, "message" => $message]);
    exit(201);
}

return_the_response('false', "Convert successfully $return");