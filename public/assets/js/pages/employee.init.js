var updateid = "";
var currentId = "";
var errorMsg = "Oops, there was an error, please try again later...";

async function deleteEmployee(employeeId) {
  currentId = employeeId.split("-")[2];
  try {
    const response = await fetch(`/users/${currentId}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();
    if (!res.success) {
      throw new Error(`Response message: ${res.message}`);
    }

    document.getElementById(employeeId)?.remove();
  } catch (error) {
    alert(errorMsg);
    console.error(error.message);
  }
}

async function editEmployee(employeeId) {
  updateid = employeeId;
  currentId = employeeId.split("-")[2];

  try {
    const response = await fetch(`/users/${currentId}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();
    const data = res.data;

    document.querySelector("#employeeName").value = data.name;
    document.querySelector("#employeePosition").value = data.position;
    document.querySelector("#exampleEmailId").value = data.email;
    document.querySelector("#PhoneNo").value = data.phone;

    multipleCancelButton.removeActiveItems();
    if (data.tags) {
      data.tags
        .split(",")
        .forEach((tag) => multipleCancelButton.setChoiceByValue(tag));
    }

    toggleFormVisibility(true);
  } catch (error) {
    alert(errorMsg);
    console.error(error.message);
  }
}

function toggleFormVisibility(isUpdateMode) {
  document.querySelector("#updateemployeedetail").style.display = isUpdateMode
    ? "block"
    : "none";
  document.querySelector("#addemployee").style.display = isUpdateMode
    ? "none"
    : "block";

  document.querySelector(".update-employee-title").style.display = isUpdateMode
    ? "block"
    : "none";
  document.querySelector(".add-employee-title").style.display = isUpdateMode
    ? "none"
    : "block";
}

function addEmployee() {
  const form = document.getElementById("NewemployeeForm");
  const updateDetails = document.querySelector("#updateemployeedetail");
  const addEmployeeButton = document.querySelector("#addemployee");
  const updateEmployeeTitle = document.querySelector(".update-employee-title");
  const addEmployeeTitle = document.querySelector(".add-employee-title");

  form.reset();
  updateDetails.style.display = "none";
  addEmployeeButton.style.display = "block";
  updateEmployeeTitle.style.display = "none";
  addEmployeeTitle.style.display = "block";

  multipleCancelButton.clearInput();
}

function searchEmployee() {
  const searchQuery = document
    .getElementById("search-employee")
    .value.toLowerCase();
  const employeeItems = document.querySelectorAll(
    "#employee-items .employee-item"
  );

  employeeItems.forEach((item) => {
    const employeeName = item
      .querySelector(".employee-name")
      .textContent.toLowerCase();
    item.style.display = employeeName.includes(searchQuery) ? "" : "none";
  });
}

document
  .getElementById("updateemployeedetail")
  .addEventListener("click", async function () {
    try {
      const employeeName = document.querySelector("#employeeName").value;
      const employeePosition =
        document.querySelector("#employeePosition").value;
      const tagsElement = document.querySelectorAll(
        ".choices__list.choices__list--multiple>.choices__item.choices__item--selectable"
      );
      const email = document.querySelector("#exampleEmailId").value;
      const phone = document.querySelector("#PhoneNo").value;

      const tags = Array.from(tagsElement).map((e) => e.dataset.value);
      const tagsHTML = tags
        .map(
          (tag) => `<span class="badge badge-soft-secondary p-2">${tag}</span>`
        )
        .join(" ");

      let password = document.querySelector("#Password").value;
      if (password.length) {
        const passwordConfirmation = document.querySelector(
          "#PasswordConfirmation"
        ).value;

        if (password != passwordConfirmation) {
          throw new Error("Password confirmation does not match");
        }
      } else {
        password = null;
      }

      const response = await fetch(`/users/${currentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: employeeName,
          position: employeePosition,
          email,
          phone,
          tags: tags.join(","),
          password,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const res = await response.json();

      if (!res.success) {
        throw new Error(`Response message: ${res.message}`);
      }

      const updateEmployeeHTML = `
    <div class="card">
      <div class="card-body">
        <div class="text-end">
          <div class="dropdown">
            <a href="#" class="dropdown-toggle font-size-16 text-muted" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="mdi mdi-dots-horizontal"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-end">
              <a class="dropdown-item text-primary" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target=".bs-example-edit-employee" onclick="editEmployee('${updateid}')">
                <i class="mdi mdi-file-document-edit-outline me-2"></i>Edit
              </a>
              <a class="dropdown-item text-danger delete-item" onclick="deleteEmployee('${updateid}')" href="javascript:void(0);">
                <i class="mdi mdi-trash-can-outline me-2"></i>Remove
              </a>
            </div>
          </div>
        </div>
        <div class="text-center">
          <img
            src="https://api.dicebear.com/9.x/identicon/svg?seed=${employeeName}"
            class="avatar-lg img-fluid rounded-circle employee-image border border-dark-subtle"
            data-type="image"
            alt="user-image"
          />
          <h6 class="font-size-15 mt-3 mb-1">
            <a href="#" class="text-primary employee-name">${employeeName}</a>
          </h6>
          <p class="text-muted mb-0 font-size-12 fw-medium employee-designation">${employeePosition}</p>
        </div>
        <div class="d-flex flex-wrap gap-2 mt-3 justify-content-center">
          <div><p class="text-muted fw-medium mb-0">Tag:</p></div>
          <div class="employee-tags d-flex flex-wrap gap-1">${tagsHTML}</div>
        </div>
      </div>
      <div class="card-footer p-0">
        <div class="row g-0">
          <div class="col-6 text-center border-end p-3">
            <h6 class="font-size-14 mb-0">
              <a href="javascript:void(0);" class="text-muted employee-email" data-bs-toggle="tooltip" title="${email}">
                <i class="mdi mdi-email-outline align-middle me-2"></i>E-mail
              </a>
            </h6>
          </div>
          <div class="col-6 text-center p-3">
            <h6 class="font-size-14 text-muted mb-0">
              <a href="javascript:void(0);" class="text-muted employee-phoneno" data-bs-toggle="tooltip" title="${phone}">
                <i class="mdi mdi-phone-outline align-middle me-2"></i>Phone
              </a>
            </h6>
          </div>
        </div>
      </div>
    </div>`;

      document.getElementById(updateid).innerHTML = updateEmployeeHTML;
      document.getElementById("update-employee").click();
      document.getElementById("NewemployeeForm").reset();
    } catch (error) {
      alert(errorMsg);
      console.error(error.message);
    }
  });

document
  .getElementById("addemployee")
  .addEventListener("click", async function () {
    try {
      const employeeName = document.querySelector("#employeeName").value;
      const employeePosition =
        document.querySelector("#employeePosition").value;
      const tagsElement = document.querySelectorAll(
        ".choices__list.choices__list--multiple>.choices__item.choices__item--selectable"
      );
      const email = document.querySelector("#exampleEmailId").value;
      const phone = document.querySelector("#PhoneNo").value;

      const tags = Array.from(tagsElement).map((e) => e.dataset.value);
      const tagsHTML = tags
        .map(
          (tag) => `<span class="badge badge-soft-secondary p-2">${tag}</span>`
        )
        .join(" ");

      const password = document.querySelector("#Password").value;
      const passwordConfirmation = document.querySelector(
        "#PasswordConfirmation"
      ).value;

      if (password != passwordConfirmation) {
        throw new Error("Password confirmation does not match");
      }

      const response = await fetch(`/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: employeeName,
          position: employeePosition,
          email,
          phone,
          tags: tags.join(","),
          password,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const res = await response.json();

      if (!res.success) {
        throw new Error(`Response message: ${res.message}`);
      }
      const data = res.data;

      const itemID = `employee-items-${data.id}`;

      const newEmployeeHTML = `
      <div class="col-xl-3 col-md-6 employee-item" id="${itemID}">
        <div class="card">
          <div class="card-body">
            <div class="text-end">
              <div class="dropdown">
                <a href="#" class="dropdown-toggle font-size-16 text-muted" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="mdi mdi-dots-horizontal"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-end">
                  <a class="dropdown-item text-primary" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target=".bs-example-edit-employee" onclick="editEmployee('${itemID}')">
                    <i class="mdi mdi-file-document-edit-outline me-2"></i>Edit
                  </a>
                  <a class="dropdown-item text-danger delete-item" onclick="deleteEmployee('${itemID}')" href="javascript:void(0);">
                    <i class="mdi mdi-trash-can-outline me-2"></i>Remove
                  </a>
                </div>
              </div>
            </div>
            <div class="text-center">
              <img
                src="https://api.dicebear.com/9.x/identicon/svg?seed=${employeeName}"
                class="avatar-lg img-fluid rounded-circle employee-image border border-dark-subtle"
                data-type="image"
                alt="user-image"
              />
              <h6 class="font-size-15 mt-3 mb-1">
                <a href="#" class="text-primary employee-name">${employeeName}</a>
              </h6>
              <p class="text-muted mb-0 font-size-12 fw-medium employee-designation">${employeePosition}</p>
            </div>
            <div class="d-flex flex-wrap gap-2 mt-3 justify-content-center">
              <div><p class="text-muted fw-medium mb-0">Tag:</p></div>
              <div class="employee-tags d-flex flex-wrap gap-1">${tagsHTML}</div>
            </div>
          </div>
          <div class="card-footer p-0">
            <div class="row g-0">
              <div class="col-6 text-center border-end p-3">
                <h6 class="font-size-14 mb-0">
                  <a href="javascript:void(0);" class="text-muted employee-email" data-bs-toggle="tooltip" title="${email}">
                    <i class="mdi mdi-email-outline align-middle me-2"></i>E-mail
                  </a>
                </h6>
              </div>
              <div class="col-6 text-center p-3">
                <h6 class="font-size-14 text-muted mb-0">
                  <a href="javascript:void(0);" class="text-muted employee-phoneno" data-bs-toggle="tooltip" title="${phone}">
                    <i class="mdi mdi-phone-outline align-middle me-2"></i>Phone
                  </a>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>`;

      document
        .querySelector("#employee-items")
        .insertAdjacentHTML("beforeend", newEmployeeHTML);
      document.getElementById("update-employee").click();
      document.getElementById("NewemployeeForm").reset();
    } catch (error) {
      alert(errorMsg);
      console.error(error.message);
    }
  });
