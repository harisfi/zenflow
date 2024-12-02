var updateid = "";
var currentId = "";
var errorMsg = "Oops, there was an error, please try again later...";

async function deleteProjects(projectId) {
  currentId = projectId.split("-")[2];
  try {
    const response = await fetch(`/${currentId}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();
    if (!res.success) {
      throw new Error(`Response message: ${res.message}`);
    }

    document.getElementById(projectId)?.remove();
  } catch (error) {
    alert(errorMsg);
    console.error(error.message);
  }
}

// Edit project details and populate the form with existing data
async function editProjects(projectId) {
  const projectCard = document.getElementById(projectId);
  updateid = projectId;

  if (!projectCard) return; // Early exit if the project doesn't exist

  currentId = projectId.split("-")[2];
  try {
    const response = await fetch(`/${currentId}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();
    if (!res.success) {
      throw new Error(`Response message: ${res.message}`);
    }
    const data = res.data;

    document.querySelector("#projectName").value = data.name || "";
    document.querySelector("#projectDetails").value = data.details || "";
    teamStatusSelect.setChoiceByValue(data.status);

    const assignees = data.Users.map((e) => `member-${e.id}`);
    assignees.forEach((assignee) => {
      const checkbox = document.getElementById(assignee);
      if (checkbox) checkbox.checked = true;
    });
  } catch (error) {
    alert(errorMsg);
    console.error(error.message);
  }

  toggleFormVisibility(true);
}

// Helper function to toggle form visibility between edit and add modes
function toggleFormVisibility(isEditMode) {
  document.querySelector("#updateprojectdetail").style.display = isEditMode
    ? "block"
    : "none";
  document.querySelector("#addproject").style.display = isEditMode
    ? "none"
    : "block";

  document.querySelector(".update-project-title").style.display = isEditMode
    ? "block"
    : "none";
  document.querySelector(".add-project-title").style.display = isEditMode
    ? "none"
    : "block";
}

// Reset form and toggle visibility for adding a new project
function addProjects() {
  document.getElementById("NewtaskForm").reset();
  toggleFormVisibility(false);
}

// Search and filter teams based on input
function searchTeam() {
  const searchTerm = document.getElementById("search-team").value.toLowerCase();
  const teamBoxes = document.querySelectorAll("#all-projects .team-box");

  teamBoxes.forEach((teamBox) => {
    const title = teamBox
      .querySelector(".team-title")
      ?.textContent.toLowerCase();
    teamBox.style.display = title.includes(searchTerm) ? "" : "none";
  });
}

// Helper function to toggle form visibility between add and edit modes
function toggleFormVisibility(isEditMode) {
  document.querySelector("#updateprojectdetail").style.display = isEditMode
    ? "block"
    : "none";
  document.querySelector("#addproject").style.display = isEditMode
    ? "none"
    : "block";

  document.querySelector(".update-project-title").style.display = isEditMode
    ? "block"
    : "none";
  document.querySelector(".add-project-title").style.display = isEditMode
    ? "none"
    : "block";
}

// Shared helper function to generate avatar HTML
function generateAvatarHTML(ids, types, contents) {
  let avatarHTML = "";
  let extraCount = 0;

  ids.forEach((id, index) => {
    if (index < 3) {
      const content =
        types[index] === "image"
          ? `<img src="${contents[index]}" alt="" class="rounded-circle avatar-sm">`
          : contents[index].outerHTML;

      avatarHTML += `
        <div class="avatar-group-item">
          <a href="#" class="d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" value="${id}" title="">
            ${content}
          </a>
        </div>`;
    } else {
      extraCount++;
    }
  });

  // Add a "+n" badge if there are extra avatars
  if (extraCount > 0) {
    avatarHTML += `
      <div class="avatar-group-item">
        <a href="#" class="d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" value="${extraCount}" title="">
          <div class="avatar-sm">
            <div class="avatar-title rounded-circle bg-primary">+${extraCount}</div>
          </div>
        </a>
      </div>`;
  }
  return avatarHTML;
}

// Common function to handle project updates and additions
async function handleProjectSubmission(isEditMode) {
  try {
    const name = document.querySelector("#projectName").value;
    const details = document.querySelector("#projectDetails").value.trim();
    const status = document.querySelector("#team-status").value;

    // Collect checked assignee data
    const ids = [],
      types = [],
      contents = [];
    document
      .querySelectorAll("#taskassignee input[type=checkbox]:checked")
      .forEach((e) => {
        ids.push(e.getAttribute("id"));
        types.push(e.getAttribute("data-type"));
        const content =
          e.getAttribute("data-type") === "image"
            ? e.nextElementSibling.getAttribute("src")
            : e.nextElementSibling;
        contents.push(content);
      });

    let response;

    if (!isEditMode) {
      response = await fetch(`/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          details,
          status,
          user_ids: ids.map((e) => e.split("-")[1]),
        }),
      });
    } else {
      response = await fetch(`/${updateid.split("-")[2]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          details,
          status,
          user_ids: ids.map((e) => e.split("-")[1]),
        }),
      });
    }
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();
    if (!res.success) {
      throw new Error(`Response message: ${res.message}`);
    }

    const projectId = `project-items-${res.data.id}`;

    const statusClass =
      {
        PENDING: "danger",
        PROGRESS: "warning",
        COMPLETED: "success",
      }[status] || "secondary";

    // Generate avatar HTML
    const avatarHTML = generateAvatarHTML(ids, types, contents);

    // Create project card HTML
    const projectHTML = `
      <div class="card">
        <div class="card-body">
          <div class="d-flex mb-3">
            <div class="flex-grow-1">
              <h6 class="mb-0 text-muted">
                <i class="mdi mdi-circle-medium text-${statusClass} fs-3 align-middle"></i>
                <span class="team-date">${dayjs(res.data.createdAt).format(
                  "DD MMM, YYYY"
                )}</span>
              </h6>
            </div>
            <div class="dropdown ms-2">
              <a href="#" class="dropdown-toggle font-size-16 text-muted" data-bs-toggle="dropdown">
                <i class="mdi mdi-dots-horizontal"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-end">
                <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target=".bs-example-new-project" onclick="editProjects('${projectId}')">Edit</a>
                <a class="dropdown-item delete-item" onclick="deleteProjects('${projectId}')">Delete</a>
              </div>
            </div>
          </div>
          <div class="mb-4">
            <h5 class="mb-1 font-size-17 team-title">
              <a href="/${res.data.id}/tasks">${name}</a>
            </h5>
            <p class="text-muted team-description">${details}</p>
          </div>
          <div class="d-flex">
            <div class="avatar-group flex-grow-1">${avatarHTML}</div>
            <div class="align-self-end">
              <span class="badge badge-soft-${statusClass} p-2 team-status">${status}</span>
            </div>
          </div>
        </div>
      </div>`;

    // Insert or update the project card
    if (isEditMode) {
      document.getElementById(projectId).innerHTML = projectHTML;
    } else {
      document
        .querySelector("#all-projects")
        .insertAdjacentHTML(
          "beforeend",
          `<div class="col-xl-3 col-md-6 team-box" id="${projectId}">${projectHTML}</div>`
        );
    }

    // Reset form and close modal
    document.getElementById("NewtaskForm").reset();
    document.getElementById("update-team").click();
  } catch (error) {
    alert(errorMsg);
    console.error(error.message);
  }
}

// Event listeners for update and add project actions
document
  .getElementById("updateprojectdetail")
  .addEventListener("click", () => handleProjectSubmission(true));
document
  .getElementById("addproject")
  .addEventListener("click", () => handleProjectSubmission(false));
