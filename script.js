const logoutLink = document.querySelector("#logoutLink");
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("role");
    window.location.href = "index.html";
  });
}

const role = localStorage.getItem("role"); 
const isAdmin = role === "administrator";

if (!role && !window.location.pathname.endsWith("index.html")) {
  window.location.href = "index.html";
}

const courseSelect = document.querySelector("#courseName");

if (courseSelect) {
  const descriptionEl = document.querySelector("#description");
  const subjectAreaEl = document.querySelector("#subjectArea");
  const creditsEl = document.querySelector("#credits");
  const courseForm = document.querySelector("#courseForm");

  const courseData = {
    "Web Development I": {
      description:
        "Introduction to HTML, CSS, and foundational web development concepts used in modern applications.",
      subjectArea: "Computer Science",
      credits: 3,
    },
    "Database Fundamentals": {
      description:
        "Covers relational database concepts, SQL queries, normalization, and data modeling techniques.",
      subjectArea: "Information Systems",
      credits: 4,
    },
    "Software Development Concepts": {
      description:
        "Overview of programming logic, software development life cycles, and collaborative development practices.",
      subjectArea: "Software Engineering",
      credits: 3,
    },
    "Cybersecurity Basics": {
      description:
        "Introduction to cybersecurity principles, common threats, and risk mitigation strategies.",
      subjectArea: "Cybersecurity",
      credits: 3,
    },
  };

  function fillCourseFields() {
    const info = courseData[courseSelect.value];
    if (!info) return;

    descriptionEl.value = info.description;
    subjectAreaEl.value = info.subjectArea;
    creditsEl.value = info.credits;
  }

  courseSelect.addEventListener("change", fillCourseFields);
  fillCourseFields();

  if (courseForm) {
    if (!isAdmin) {
      courseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Only administrators can enroll students.");
      });
    } else {
      courseForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = courseSelect.value;
        if (!name) return;

        const res = await fetch("/api/enrollments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-role": role, 
          },
          body: JSON.stringify({ name }),
        });

        if (res.ok) {
          window.location.href = "courses.html";
        } else {
          alert("Could not enroll.");
        }
      });
    }
  }
}

const courseCards = document.querySelectorAll(".course-card");

if (courseCards.length) {
  if (!isAdmin) {
    document.querySelectorAll(".course-card .actions").forEach((actions) => {
      actions.style.display = "none";
    });
  }

  document.querySelectorAll(".course-select").forEach((cb) => (cb.disabled = true));

  (async () => {
    const res = await fetch("/api/enrollments");
    if (!res.ok) return;

    const enrolled = await res.json();

    courseCards.forEach((card) => {
      const title = card.querySelector("h2")?.textContent.trim();
      const checkbox = card.querySelector(".course-select");
      if (!title || !checkbox) return;

      checkbox.checked = enrolled.includes(title);
    });
  })();

  if (isAdmin) {
    document.querySelectorAll(".course-card .btn.danger").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const card = btn.closest(".course-card");
        const title = card?.querySelector("h2")?.textContent.trim();
        if (!title) return;

        window.location.href = `delete-confirm.html?name=${encodeURIComponent(title)}`;
      });
    });
  }
}

const confirmRemoveBtn = document.querySelector("#confirmRemoveBtn");

if (confirmRemoveBtn) {
  if (!isAdmin) {
    confirmRemoveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Only administrators can remove enrollments.");
    });
  } else {
    confirmRemoveBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const courseName = new URLSearchParams(window.location.search).get("name");
      if (!courseName) return alert("No course selected.");

      const res = await fetch(
        `/api/enrollments/${encodeURIComponent(courseName)}`,
        {
          method: "DELETE",
          headers: { "x-role": role }, 
        }
      );

      if (res.ok) {
        window.location.href = "courses.html";
      } else {
        alert("Could not remove course.");
      }
    });
  }
}