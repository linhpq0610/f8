// http://localhost:3000/course
const courseApi = "http://localhost:3000/course";
const courseListBlock = document.getElementById("list-courses");

function start() {
  getCourses(courseApi, renderCourses);
  handleCreateForm();
}
start();

function getCourses(api, callback) {
  fetch(api)
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

function renderCourses(courses) {
  courses.forEach(renderSingleCourse);
}

function renderSingleCourse(course) {
  const html = `
    <li class="course-item-${course.id}">
      <h2 class="name">${course.name}</h2>
      <p class="description">${course.description}</p>
      <button onclick="handleDeleteCourse(${course.id})">Xoa</button>
      <button onclick="handleUpdateCourse(${course.id})">Cap nhat</button>
    </li>`;
  courseListBlock.innerHTML += html;
}

function handleCreateForm() {
  const createBtn = document.getElementById("create");
  createBtn.onclick = function () {
    const name = document.querySelector('input[name="name"]').value;
    const description = document.querySelector(
      'input[name="description"]'
    ).value;
    const formData = { name, description };
    createCourse(formData, renderSingleCourse);
  };
}

function createCourse(data, callback) {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(courseApi, option)
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

function handleDeleteCourse(courseId) {
  fetch(`${courseApi}/${courseId}`, {
    method: "DELETE",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function () {
      const courseItem = document.querySelector(`.course-item-${courseId}`);
      courseItem?.remove();
    });
}

function handleUpdateCourse(courseId) {
  const createBtn = document.getElementById("create");
  const nameInput = document.querySelector('input[name="name"]');
  const descInput = document.querySelector('input[name="description"]');

  createBtn.textContent = "Update";
  getCourses(`${courseApi}/${courseId}`, function (course) {
    nameInput.value = course.name;
    descInput.value = course.description;

    createBtn.onclick = function () {
      const data = { name: nameInput.value, description: descInput.value };
      updateCourse(`${courseApi}/${courseId}`, data);
      const courseItem = document.querySelector(`.course-item-${courseId}`);
      const nameItem = courseItem.querySelector(".name");
      const descItem = courseItem.querySelector(".description");
      nameItem.textContent = nameInput.value;
      descItem.textContent = descInput.value;
      createBtn.textContent = "Create";
    };
  });
}

function updateCourse(api, data) {
  fetch(api, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
