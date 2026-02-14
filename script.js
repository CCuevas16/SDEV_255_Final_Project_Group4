
const courseSelect = document.querySelector("#courseName");

if (courseSelect) {
  const descriptionEl = document.querySelector("#description");
  const subjectAreaEl = document.querySelector("#subjectArea");
  const creditsEl = document.querySelector("#credits");

  const courseData = {
    "Web Development I": {
      description:
        "Introduction to HTML, CSS, and foundational web development tool and methods.",
      subjectArea: "Computer Science",
      credits: 3,
    },
    "Database Fundamentals": {
      description:
        "Overview on stucturing, collecting, and managing a collection of data.",
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

  courseSelect.addEventListener("change", function() {
    const selectedName = courseSelect.value; 
    const info = courseData[selectedName];
    if (!info) return;

    descriptionEl.value = info.description;
    subjectAreaEl.value = info.subjectArea;
    creditsEl.value = info.credits;
  });
//---------------------------------------------------------------------------------------------------------------------------------------
  const courseForm = document.querySelector("#courseForm");
  if (courseForm) {
    courseForm.addEventListener("submit", function(event) {
      event.preventDefault();

      const selectedName = courseSelect.value;
      if (!selectedName) return;

      
      localStorage.setItem("enrolledCourseName", selectedName);

      
      window.location.href = "courses.html";
    });
  }
}


const courseCards = document.querySelectorAll(".course-card");

if (courseCards.length) {
  
  document.querySelectorAll(".course-select").forEach(function(cb) {
    cb.disabled = true;
  });

  
  const enrolledName = localStorage.getItem("enrolledCourseName");
  if (enrolledName) {
    courseCards.forEach(function(card) {
      const title = card.querySelector("h2")?.textContent.trim();
      const checkbox = card.querySelector(".course-select");

      if (title === enrolledName && checkbox) {
        checkbox.checked = true;
      }
    });
  }


  document.querySelectorAll(".course-card .btn.danger").forEach(function(btn) {
    btn.addEventListener("click", function() {
      const card = btn.closest(".course-card");
      const title = card?.querySelector("h2")?.textContent.trim();
      if (title) localStorage.setItem("pendingDeleteCourseName", title);
    });
  });
}


const confirmRemoveBtn = document.querySelector("main.box .btn.danger");

if (confirmRemoveBtn) {
  confirmRemoveBtn.addEventListener("click", function(e){
    e.preventDefault();

    const pending = localStorage.getItem("pendingDeleteCourseName");
    const enrolled = localStorage.getItem("enrolledCourseName");

    if (pending && enrolled && pending === enrolled) {
      localStorage.removeItem("enrolledCourseName");
    }

    localStorage.removeItem("pendingDeleteCourseName");
    window.location.href = "courses.html";
  });
}
