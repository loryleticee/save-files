
$("#form_controller").on("submit", (e) => {
    e.preventDefault();
    fetchSaveFiles();
})

function toggleSpinner() {
    $("._spinner").toggleClass("visually-hidden")
    $("._submit").toggleClass("visually-hidden")
}

var fileList = new Set();
var fileInput = document.getElementById('_files');

let authorized_format_file = [
    "image/jpeg",
    "image/jpg",
];

fileInput.addEventListener('change', function() {
    fileList.clear()
    for (var i = 0; i < fileInput.files.length; i++) {
        if (!authorized_format_file.includes(fileInput.files[i].type)) {
            alert(`
                You can only upload ${authorized_format_file[0]} or ${authorized_format_file[1]} files.
                The file ${fileInput.files[i].name} did not upload
            `);

            continue
        }
        fileList.add(fileInput.files[i]);
    }
});

function fetchSaveFiles() {
    if (fileList.size < 1) {
        alert("Add an image")
        return false;
    }

    if (fileList.size > 3) {
        alert("You can only upload a maximum of 3 files");
        return false;
    }

    const Files = fileList.values();
    toggleSpinner()
    saveFiles(Files);
}

var formData = new FormData();

function saveFiles(Files) {
    let file = Files.next().value;
    if (!file) { 
        toggleSpinner()
        return false
    }
    formData.set('file', file);

    $.ajax({
        url: '/run.php',
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'POST',
        success: function(response) {
            let html =
                `<div class="px-5"> 
                    <span class="text-light">${ response?.message ?? "" }</span>
                </div>`;
            $("#form_controller").append($(html) ?? "");

            saveFiles(Files);
        },
        error: function(error) {
            console.log(error ?? "");
            saveFiles(Files);
        }
    })
}