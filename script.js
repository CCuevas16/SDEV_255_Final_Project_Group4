
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
    courseForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = courseSelect.value;
      if (!name) return;

      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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


const courseCards = document.querySelectorAll(".course-card");

if (courseCards.length) {
  document.querySelectorAll(".course-select").forEach(cb => cb.disabled = true);

  (async () => {
    const res = await fetch("/api/enrollments");
    if (!res.ok) return;

    const enrolled = await res.json();

    courseCards.forEach(card => {
      const title = card.querySelector("h2")?.textContent.trim();
      const checkbox = card.querySelector(".course-select");
      if (!title || !checkbox) return;

      checkbox.checked = enrolled.includes(title);
    });
  })();

  document.querySelectorAll(".course-card .btn.danger").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const card = btn.closest(".course-card");
      const title = card?.querySelector("h2")?.textContent.trim();
      if (!title) return;

      window.location.href = `delete-confirm.html?name=${encodeURIComponent(title)}`;
    });
  });
}

const confirmRemoveBtn = document.querySelector("#confirmRemoveBtn");

if (confirmRemoveBtn) {
  confirmRemoveBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const courseName = new URLSearchParams(window.location.search).get("name");
    if (!courseName) return alert("No course selected.");

    const res = await fetch(`/api/enrollments/${encodeURIComponent(courseName)}`, {
      method: "DELETE",
    });

    if (res.ok) {
      window.location.href = "courses.html";
    } else {
      alert("Could not remove course.");
    }
  });
}