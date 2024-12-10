document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("NewtaskForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    try {
      const taskCode = document.getElementById("taskcode").value.trim();
      const taskName = document.getElementById("taskname").value.trim();
      const taskDesc = document.getElementById("taskdesc").value.trim();
      const taskDueDate = document.getElementById("task-duedate").value;
      const taskCategory = document.getElementById("taskcategory").value;
      const projectId = document.getElementById("projectId").value.trim();
      const taskStage = document.getElementById("taskstage").value.trim();

      const ids = [],
      types = [],
      contents = [];

      document.querySelectorAll("#taskassignee input[type=checkbox]:checked")
        .forEach((e) => {
          ids.push(e.getAttribute("id"));
          types.push(e.getAttribute("data-type"));
          const content =
            e.getAttribute("data-type") === "image"
              ? e.nextElementSibling.getAttribute("src")
              : e.nextElementSibling;
          contents.push(content);
        });

      // Construct the payload
      const payload = {
        code: taskCode,
        name: taskName,
        description: taskDesc,
        due_date: taskDueDate,
        category: taskCategory,
        user_ids: ids.map((e) => e.split("-")[1]),
        project_id: projectId,
        stage: taskStage,
      };

      // Send POST request
      const response = await fetch(`/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      alert("Task created successfully!");

      // Optionally reload the page or redirect
      window.location.reload();
    } catch (error) {
      console.error("Failed to create task:", error);
      alert(`Failed to create task: ${error.message}`);
    }
  });

  document.querySelectorAll('.dropdown-move .dropdown-item').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();

        const taskElement = event.target.closest('.dropdown-menu-end'); 
        const taskId = taskElement.getAttribute('data-task-id'); 
        const selectedStage = event.target.textContent.trim();

        moveTaskToStage(taskId, selectedStage);
    });
  });
});

async function moveTaskToStage(taskId, stage) {
  try {
    const response = await fetch(`/:projectId/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stage }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Task moved successfully:`, data);
      location.reload();
    } else {
        console.error(`Failed to move task:`, response.status, response.statusText);
    }
  } catch (error) {
      console.error(`Error moving task:`, error);
  }
}

async function eTask(taskId) {
  try {
    const response = await fetch(`/:projectId/tasks/${taskId}`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();
    const data = res.data; 
    const listedUsers = res.allUsers;
    const taskUsers = data.Users;
    const dueDate = data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : '';

    // Inject the modal HTML into the DOM
    const modalHTML = `
      <div class="modal fade bs-task-edit" tabindex="-1" role="dialog" id="modalFormUpdate" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title mt-0 add-task-title" id="add-task-title">Update Task</h5>
              <button type="button" id="update-task" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="EditTaskForm">
                <input type="hidden" value="<%= projectId %>" id="projectId">
                <div class="mb-3">
                  <label for="taskname" class="form-label">Task Code</label>
                  <input id="Etaskcode" type="text" class="form-control validate" value="${data.code}" required />
                </div>
                <div class="mb-3">
                  <label for="taskname" class="form-label">Task Name</label>
                  <input id="Etaskname" type="text" class="form-control validate" value="${data.name}" required />
                </div>
                <div class="mb-3">
                  <label for="taskdesc" class="form-label">Task Description</label>
                  <textarea id="Etaskdesc" class="form-control">${data.description}</textarea>
                </div>
                <div class="row">
                  <div class="col-md-4" id="taskbudget">
                    <div class="mb-3">
                      <label for="task-duedate" class="form-label">Due Date</label>
                      <input class="form-control" type="date" id="Etask-duedate" value="${dueDate}" />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Categories</label>
                      <div>
                        <select class="form-control" id="Etaskcategory" required>
                          <option value="" disabled>Choose...</option>
                          <option value="DESIGN" ${data.category === "DESIGN" ? "selected" : ""}>DESIGN</option>
                          <option value="DEVELOPMENT" ${data.category === "DEVELOPMENT" ? "selected" : ""}>DEVELOPMENT</option>
                          <option value="MAINTENANCE" ${data.category === "MAINTENANCE" ? "selected" : ""}>MAINTENANCE</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Stage</label>
                      <div>
                        <select class="form-control" id="Etaskstage" required>
                          <option value="BACKLOG" ${data.stage === "BACKLOG" ? "selected" : ""}>BACKLOG</option>
                          <option value="WAITING" ${data.stage === "WAITING" ? "selected" : ""}>WAITING</option>
                          <option value="DOING" ${data.stage === "DOING" ? "selected" : ""}>DOING</option>
                          <option value="REVIEW" ${data.stage === "REVIEW" ? "selected" : ""}>REVIEW</option>
                          <option value="DONE" ${data.stage === "DONE" ? "selected" : ""}>DONE</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pt-2">
                  <p class="fw-medium mb-3">Add Team Member</p>
                  <ul
                    class="list-unstyled user-list validate mt-2"
                    id="Etaskassignee"
                    data-simplebar
                    style="max-height: 160px"
                  >
                    ${listedUsers
                      .map(
                        (u) => `
                          <li>
                            <div class="form-check form-check-primary mb-2 font-size-16 d-flex align-items-center">
                              <input
                                class="form-check-input me-3"
                                type="checkbox"
                                id="${u.id}"
                                name="member[]"
                                data-type="image"
                                ${taskUsers.some((taskUser) => taskUser.id === u.id) ? "checked" : ""}
                              />
                              <img src="https://api.dicebear.com/9.x/identicon/svg?seed=${u.name}" class="rounded-circle avatar-sm" alt=""/>
                              <label class="form-check-label font-size-14 mb-0 ms-3" for="member-${u.id}">
                                ${u.name}
                              </label>
                            </div>
                          </li>
                        `
                      )
                      .join("")}
                  </ul>
                </div>
                <div class="row">
                  <div class="col-lg-10">
                    <button type="submit" class="btn btn-primary updatetask-btn">Save changes</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inject modal into the body
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Wait for modal to be inserted, then show
    const modal = new bootstrap.Modal(document.getElementById('modalFormUpdate'));
    modal.show();

    // Now add event listeners and access modal content
    const form = document.getElementById('EditTaskForm');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      uTask(taskId);
    });

  } catch (error) {
    console.error("Error fetching task details:", error);
  }
}

async function uTask(taskId) {
  try {
    // Wait until the modal content is available before accessing the form elements
    const taskCode = document.getElementById('Etaskcode').value;
    const taskName = document.getElementById('Etaskname').value;
    const taskDescription = document.getElementById('Etaskdesc').value;
    const dueDate = document.getElementById('Etask-duedate').value;
    const taskCategory = document.getElementById('Etaskcategory').value;
    const taskStage = document.getElementById('Etaskstage').value;

    // Collect the assignees (who are checked)
    const assignees = [];
    const assigneeCheckboxes = document.querySelectorAll('#Etaskassignee input[type="checkbox"]:checked');
    assigneeCheckboxes.forEach((checkbox) => {
      assignees.push(checkbox.id); // Add only the ID, not an object
    });

    // Prepare data to be sent to the backend
    const taskData = {
      code: taskCode,
      name: taskName,
      description: taskDescription,
      due_date: dueDate,
      category: taskCategory,
      stage: taskStage,
      user_ids: assignees,
    };

    // Send the PUT request to update the task
    const response = await fetch(`/:projectId/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData), // Pass the updated task data
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Task updated successfully:', data);
      location.reload(); // Reload the page after successful update
    } else {
      console.error('Failed to update task:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`/:projectId/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Task DELETED successfully:`, data);
      location.reload();
    } else {
        console.error(`Failed to move task:`, response.status, response.statusText);
    }
  } catch (error) {
      console.error(`Error moving task:`, error);
  }
}
