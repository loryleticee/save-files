(<HTMLInputElement>(
  document.getElementById("form_controller")
))?.addEventListener("submit", (e: Event): void => {
  e.preventDefault();
  fetchSaveFiles();
});

function toggleSpinner(): void {
  $("._spinner").toggleClass("visually-hidden");
  $("._submit").toggleClass("visually-hidden");
}

var fileList: Set<File> = new Set();
var fileInput: HTMLInputElement | null = <HTMLInputElement>(
  document.getElementById("_files")
);

var authorized_format_file: string[] = ["image/jpeg", "image/jpg"];

fileInput?.addEventListener("change", function () {
  fileList.clear();

  if (fileInput !== null && fileInput.files !== null) {
    for (var i = 0; i < fileInput.files.length; i++) {
      if (!authorized_format_file?.includes(fileInput?.files[i]?.type)) {
        alert(`
                You can only upload ${authorized_format_file[0]} or ${authorized_format_file[1]} files.
                The file ${fileInput?.files[i]?.name} did not upload
            `);

        continue;
      }
      fileList.add(fileInput.files[i]);
    }
  }
});

function fetchSaveFiles(): void | boolean {
  if (fileList?.size < 1) {
    alert("Add an image");
    return false;
  }

  if (fileList?.size > 3) {
    alert("You can only upload a maximum of 3 files");
    return false;
  }

  const Files: IterableIterator<File> = fileList?.values();
  toggleSpinner();
  saveFiles(Files);
}

var formData = new FormData();

function saveFiles(Files: IterableIterator<File>): void | boolean {
  let file: File = Files.next().value;
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
    success: function (response: ServerResponse) {
      let html: string = `
        <div class="px-5"> 
                    <span class="text-light">${response?.message ?? ""}</span>
        </div>`;
      $("#form_controller").append($(html) ?? "");

      saveFiles(Files);
    },
    error: function (error: object) {
      console.log(error ?? "");
      saveFiles(Files);
    },
  });
}

type ServerResponse = {
  error: string;
  message: string;
};
