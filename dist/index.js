"use strict";
var _a;
(_a = (document.getElementById("form_controller"))) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchSaveFiles();
});
function toggleSpinner() {
    $("._spinner").toggleClass("visually-hidden");
    $("._submit").toggleClass("visually-hidden");
}
var fileList = new Set();
var fileInput = (document.getElementById("_files"));
var authorized_format_file = ["image/jpeg", "image/jpg"];
fileInput === null || fileInput === void 0 ? void 0 : fileInput.addEventListener("change", function () {
    var _a, _b;
    fileList.clear();
    if (fileInput !== null && fileInput.files !== null) {
        for (var i = 0; i < fileInput.files.length; i++) {
            if (!(authorized_format_file === null || authorized_format_file === void 0 ? void 0 : authorized_format_file.includes((_a = fileInput === null || fileInput === void 0 ? void 0 : fileInput.files[i]) === null || _a === void 0 ? void 0 : _a.type))) {
                alert(`
                You can only upload ${authorized_format_file[0]} or ${authorized_format_file[1]} files.
                The file ${(_b = fileInput === null || fileInput === void 0 ? void 0 : fileInput.files[i]) === null || _b === void 0 ? void 0 : _b.name} did not upload
            `);
                continue;
            }
            fileList.add(fileInput.files[i]);
        }
    }
});
function fetchSaveFiles() {
    if ((fileList === null || fileList === void 0 ? void 0 : fileList.size) < 1) {
        alert("Add an image");
        return false;
    }
    if ((fileList === null || fileList === void 0 ? void 0 : fileList.size) > 3) {
        alert("You can only upload a maximum of 3 files");
        return false;
    }
    const Files = fileList === null || fileList === void 0 ? void 0 : fileList.values();
    toggleSpinner();
    saveFiles(Files);
}
var formData = new FormData();
function saveFiles(Files) {
    let file = Files.next().value;
    if (!file) {
        fileList.clear();
        toggleSpinner();
        return false;
    }
    formData.set("file", file);
    $.ajax({
        url: "/run.php",
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: "POST",
        success: function (response) {
            var _a, _b;
            let html = `
        <div class="px-5"> 
                    <span class="text-light">${(_a = response === null || response === void 0 ? void 0 : response.message) !== null && _a !== void 0 ? _a : ""}</span>
        </div>`;
            $("#form_controller").append((_b = $(html)) !== null && _b !== void 0 ? _b : "");
            saveFiles(Files);
        },
        error: function (error) {
            console.log(error !== null && error !== void 0 ? error : "");
            saveFiles(Files);
        },
    });
}
//# sourceMappingURL=index.js.map