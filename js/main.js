// Utility function for toast notifications
function showToast(message, type = "success", duration = 3000) {
  let toastContainer = document.getElementById("toast-container")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.id = "toast-container"
    document.body.appendChild(toastContainer)
  }

  const toast = document.createElement("div")
  toast.classList.add("toast", type)
  toast.textContent = message
  toastContainer.appendChild(toast)

  // Trigger reflow to enable transition
  void toast.offsetWidth
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
    toast.addEventListener("transitionend", () => toast.remove())
  }, duration)
}

// Form validation functions
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

function validatePassword(password) {
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.{8,})/
  return re.test(password)
}

function validateCardNumber(cardNumber) {
  // Simple check for 16 digits, can be enhanced with Luhn algorithm
  return /^\d{16}$/.test(cardNumber.replace(/\s/g, ""))
}

function validateExpiryDate(expiryDate) {
  const [month, year] = expiryDate.split("/").map(Number)
  if (!month || !year || month < 1 || month > 12) return false
  const currentYear = new Date().getFullYear() % 100 // Last two digits
  const currentMonth = new Date().getMonth() + 1 // 1-indexed
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false
  }
  return true
}

function validateCVV(cvv) {
  return /^\d{3,4}$/.test(cvv)
}

function showError(inputElement, message) {
  const inputGroup = inputElement.closest(".input-group")
  let errorMessage = inputGroup.querySelector(".error-message")
  if (!errorMessage) {
    errorMessage = document.createElement("span")
    errorMessage.classList.add("error-message")
    inputGroup.appendChild(errorMessage)
  }
  errorMessage.textContent = message
}

function clearError(inputElement) {
  const inputGroup = inputElement.closest(".input-group")
  const errorMessage = inputGroup.querySelector(".error-message")
  if (errorMessage) {
    errorMessage.textContent = ""
  }
}

// Common form input handling for floating labels
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".input-group input, .input-group textarea")
  inputs.forEach((input) => {
    // Check on load if input has content (e.g., from browser autofill)
    if (input.value) {
      input.classList.add("has-content")
    }

    input.addEventListener("focus", () => {
      input.classList.add("has-content")
    })

    input.addEventListener("blur", () => {
      if (input.value === "") {
        input.classList.remove("has-content")
      }
    })

    input.addEventListener("input", () => {
      clearError(input) // Clear error as user types
    })
  })

  // Header sticky effect
  const header = document.querySelector(".header")
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("sticky")
      } else {
        header.classList.remove("sticky")
      }
    })
  }

  // Mobile hamburger menu toggle
  const hamburgerMenu = document.querySelector(".hamburger-menu")
  const navLinks = document.querySelector(".nav-links")

  if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener("click", () => {
      hamburgerMenu.classList.toggle("active")
      navLinks.classList.toggle("active")
    })
  }

  // Scroll to Top Button
  const scrollToTopBtn = document.getElementById("scroll-to-top-btn")
  if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("show")
      } else {
        scrollToTopBtn.classList.remove("show")
      }
    })

    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // --- Page Specific Logic ---

  // Login Page Logic
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const emailInput = document.getElementById("login-email")
      const passwordInput = document.getElementById("login-password")
      const email = emailInput.value
      const password = passwordInput.value

      let isValid = true

      if (!validateEmail(email)) {
        showError(emailInput, "Please enter a valid email address.")
        isValid = false
      } else {
        clearError(emailInput)
      }

      if (password.length < 6) {
        // Simple length check for login
        showError(passwordInput, "Password must be at least 6 characters.")
        isValid = false
      } else {
        clearError(passwordInput)
      }

      if (isValid) {
        const users = JSON.parse(localStorage.getItem("smkt_users") || "[]")
        const user = users.find((u) => u.email === email && u.password === password)

        if (user) {
          localStorage.setItem("smkt_isLoggedIn", "true")
          localStorage.setItem("smkt_currentUser", JSON.stringify({ email: user.email }))
          showToast("Login successful!", "success")
          setTimeout(() => {
            window.location.href = "dashboard.html"
          }, 500)
        } else {
          showToast("Invalid email or password.", "error")
        }
      }
    })
  }

  // Signup Page Logic
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const nameInput = document.getElementById("signup-name")
      const emailInput = document.getElementById("signup-email")
      const passwordInput = document.getElementById("signup-password")
      const confirmPasswordInput = document.getElementById("signup-confirm-password")

      const name = nameInput.value
      const email = emailInput.value
      const password = passwordInput.value
      const confirmPassword = confirmPasswordInput.value

      let isValid = true

      if (name.trim() === "") {
        showError(nameInput, "Name cannot be empty.")
        isValid = false
      } else {
        clearError(nameInput)
      }

      if (!validateEmail(email)) {
        showError(emailInput, "Please enter a valid email address.")
        isValid = false
      } else {
        clearError(emailInput)
      }

      if (!validatePassword(password)) {
        showError(
          passwordInput,
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
        )
        isValid = false
      } else {
        clearError(passwordInput)
      }

      if (password !== confirmPassword) {
        showError(confirmPasswordInput, "Passwords do not match.")
        isValid = false
      } else {
        clearError(confirmPasswordInput)
      }

      if (isValid) {
        const users = JSON.parse(localStorage.getItem("smkt_users") || "[]")
        if (users.some((u) => u.email === email)) {
          showToast("Email already registered.", "error")
        } else {
          users.push({ name, email, password })
          localStorage.setItem("smkt_users", JSON.stringify(users))
          showToast("Registration successful! Please log in.", "success")
          setTimeout(() => {
            window.location.href = "login.html"
          }, 500)
        }
      }
    })
  }

  // Dashboard Page Logic
  const dashboardUsername = document.getElementById("dashboard-username")
  const totalUsersStat = document.getElementById("total-users-stat")
  const enrolledCoursesStat = document.getElementById("enrolled-courses-stat")
  const booksInCartStat = document.getElementById("books-in-cart-stat")
  const logoutBtn = document.getElementById("logout-btn")

  if (dashboardUsername) {
    // Check if user is logged in, otherwise redirect
    const isLoggedIn = localStorage.getItem("smkt_isLoggedIn")
    if (isLoggedIn !== "true") {
      window.location.href = "login.html"
      return // Stop execution if not logged in
    }

    const currentUser = JSON.parse(localStorage.getItem("smkt_currentUser") || "{}")
    if (currentUser.email) {
      const users = JSON.parse(localStorage.getItem("smkt_users") || "[]")
      const user = users.find((u) => u.email === currentUser.email)
      if (user && user.name) {
        dashboardUsername.textContent = user.name
      } else {
        dashboardUsername.textContent = currentUser.email // Fallback to email if name not found
      }
    }

    // Display stats
    const allUsers = JSON.parse(localStorage.getItem("smkt_users") || "[]")
    totalUsersStat.textContent = allUsers.length

    // Update enrolled courses and cart items counts
    const enrolledCourses = JSON.parse(localStorage.getItem("smkt_enrolledCourses") || "[]")
    enrolledCoursesStat.textContent = enrolledCourses.length

    const cartItems = JSON.parse(localStorage.getItem("smkt_cart") || "[]")
    booksInCartStat.textContent = cartItems.length

    // Logout functionality
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        localStorage.removeItem("smkt_isLoggedIn")
        localStorage.removeItem("smkt_currentUser")
        showToast("Logged out successfully!", "success")
        setTimeout(() => {
          window.location.href = "login.html"
        }, 500)
      })
    }
  }

  // Courses Page Logic
  const courseListContainer = document.getElementById("course-list")
  const courseSearchInput = document.getElementById("course-search")
  const courseCategorySelect = document.getElementById("course-category")
  const noCoursesFoundMessage = document.getElementById("no-courses-found")

  if (courseListContainer) {
    const allCategories = ["Programming", "Design", "Marketing"] // Example categories
    allCategories.forEach((category) => {
      const option = document.createElement("option")
      option.value = category
      option.textContent = category
      courseCategorySelect.appendChild(option)
    })

    function renderCourses() {
      const searchTerm = courseSearchInput.value.toLowerCase()
      const selectedCategory = courseCategorySelect.value

      // Fetch courses from API or use a predefined list
      const courses = [
        {
          id: 1,
          title: "JavaScript Basics",
          category: "Programming",
          duration: "2 Weeks",
          level: "Beginner",
          description: "Learn the fundamentals of JavaScript.",
        },
        {
          id: 2,
          title: "Advanced Python",
          category: "Programming",
          duration: "8 Weeks",
          level: "Advanced",
          description: "Dive deep into advanced Python concepts.",
        },
        {
          id: 3,
          title: "UI/UX Design",
          category: "Design",
          duration: "4 Weeks",
          level: "Intermediate",
          description: "Master the principles of UI/UX design.",
        },
        {
          id: 4,
          title: "Digital Marketing",
          category: "Marketing",
          duration: "6 Weeks",
          level: "Intermediate",
          description: "Learn the strategies for effective digital marketing.",
        },
      ]

      const filteredCourses = courses.filter((course) => {
        const matchesSearch =
          course.title.toLowerCase().includes(searchTerm) ||
          (course.description && course.description.toLowerCase().includes(searchTerm))
        const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
        return matchesSearch && matchesCategory
      })

      courseListContainer.innerHTML = ""
      if (filteredCourses.length === 0) {
        noCoursesFoundMessage.style.display = "block"
      } else {
        noCoursesFoundMessage.style.display = "none"
        filteredCourses.forEach((course) => {
          const courseCard = document.createElement("div")
          courseCard.classList.add("card", "course-card")
          courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
                <span>${course.duration}</span>
                <span>${course.level}</span>
                <span>${course.category}</span>
            </div>
            <a href="course-details.html?id=${course.id}" class="btn btn-primary">View Details</a>
          `
          courseListContainer.appendChild(courseCard)
        })
      }
    }

    courseSearchInput.addEventListener("input", renderCourses)
    courseCategorySelect.addEventListener("change", renderCourses)

    renderCourses() // Initial render
  }

  // Course Details Page Logic
  const courseDetailContent = document.getElementById("course-detail-content")
  const markCompleteBtn = document.getElementById("mark-complete-btn")
  const courseProgressPercentage = document.getElementById("course-progress-percentage")
  const progressBar = document.querySelector(".progress-bar")

  // Quiz elements
  const quizQuestionEl = document.getElementById("quiz-question")
  const quizOptionsEl = document.getElementById("quiz-options")
  const quizSubmitBtn = document.getElementById("quiz-submit-btn")
  const quizFeedbackEl = document.getElementById("quiz-feedback")
  const quizNextBtn = document.getElementById("quiz-next-btn")
  const quizScoreEl = document.getElementById("quiz-score")
  const currentScoreEl = document.getElementById("current-score")
  const totalQuestionsEl = document.getElementById("total-questions")

  // Flashcard elements
  const flashcardEl = document.getElementById("flashcard")
  const flashcardFrontEl = document.getElementById("flashcard-front")
  const flashcardBackEl = document.getElementById("flashcard-back")
  const prevFlashcardBtn = document.getElementById("prev-flashcard-btn")
  const nextFlashcardBtn = document.getElementById("next-flashcard-btn")

  if (courseDetailContent) {
    const urlParams = new URLSearchParams(window.location.search)
    const courseId = Number.parseInt(urlParams.get("id"))

    // Fetch course details from API or use a predefined list
    const courses = [
      {
        id: 1,
        title: "JavaScript Basics",
        category: "Programming",
        duration: "2 Weeks",
        level: "Beginner",
        description: "Learn the fundamentals of JavaScript.",
      },
      {
        id: 2,
        title: "Advanced Python",
        category: "Programming",
        duration: "8 Weeks",
        level: "Advanced",
        description: "Dive deep into advanced Python concepts.",
      },
      {
        id: 3,
        title: "UI/UX Design",
        category: "Design",
        duration: "4 Weeks",
        level: "Intermediate",
        description: "Master the principles of UI/UX design.",
      },
      {
        id: 4,
        title: "Digital Marketing",
        category: "Marketing",
        duration: "6 Weeks",
        level: "Intermediate",
        description: "Learn the strategies for effective digital marketing.",
      },
    ]

    const course = courses.find((c) => c.id === courseId)

    if (course) {
      courseDetailContent.innerHTML = `
        <h1 class="course-detail-title">${course.title}</h1>
        <div class="course-detail-meta">
            <span>Category: ${course.category}</span>
            <span>Duration: ${course.duration}</span>
            <span>Level: ${course.level}</span>
        </div>
        <p class="course-detail-description">${course.description}</p>
        <button class="btn btn-primary" id="enroll-course-btn">Enroll Now</button>
      `
      const enrollCourseBtn = document.getElementById("enroll-course-btn")
      if (enrollCourseBtn) {
        enrollCourseBtn.addEventListener("click", () => {
          const enrolledCourses = JSON.parse(localStorage.getItem("smkt_enrolledCourses") || "[]")
          if (!enrolledCourses.some((c) => c.id === course.id)) {
            enrolledCourses.push(course)
            localStorage.setItem("smkt_enrolledCourses", JSON.stringify(enrolledCourses))
            showToast(`Successfully enrolled in "${course.title}"!`, "success")
            // Update dashboard stat immediately
            localStorage.setItem("smkt_enrolledCoursesCount", enrolledCourses.length)
          } else {
            showToast(`You are already enrolled in "${course.title}".`, "info")
          }
        })
      }

      // Progress Tracker Logic
      let courseProgress = JSON.parse(localStorage.getItem(`smkt_course_${course.id}_progress`) || "0")
      if (courseProgressPercentage && progressBar) {
        courseProgressPercentage.textContent = courseProgress
        progressBar.style.width = `${courseProgress}%`

        if (markCompleteBtn) {
          markCompleteBtn.addEventListener("click", () => {
            courseProgress = 100
            localStorage.setItem(`smkt_course_${course.id}_progress`, courseProgress)
            courseProgressPercentage.textContent = courseProgress
            progressBar.style.width = `${courseProgress}%`
            showToast(`"${course.title}" marked as complete!`, "success")
          })
        }
      }

      // Simple Quiz Logic
      const quizData = [
        {
          question: `What is the main purpose of ${course.title}?`,
          options: ["To learn basics", "To master advanced topics", "To build projects", "All of the above"],
          answer: "To learn basics", // Simplified for example
        },
        {
          question: `How long is the ${course.title} course?`,
          options: ["2 Weeks", course.duration, "8 Weeks", "1 Week"],
          answer: course.duration,
        },
      ]
      let currentQuizQuestionIndex = 0
      let quizScore = 0

      function loadQuizQuestion() {
        if (currentQuizQuestionIndex < quizData.length) {
          const q = quizData[currentQuizQuestionIndex]
          quizQuestionEl.textContent = q.question
          quizOptionsEl.innerHTML = ""
          q.options.forEach((option) => {
            const button = document.createElement("button")
            button.textContent = option
            button.addEventListener("click", () => {
              Array.from(quizOptionsEl.children).forEach((btn) => btn.classList.remove("selected"))
              button.classList.add("selected")
            })
            quizOptionsEl.appendChild(button)
          })
          quizFeedbackEl.textContent = ""
          quizFeedbackEl.classList.remove("correct", "incorrect")
          quizSubmitBtn.style.display = "block"
          quizNextBtn.style.display = "none"
          quizScoreEl.style.display = "none"
        } else {
          quizQuestionEl.textContent = "Quiz Complete!"
          quizOptionsEl.innerHTML = ""
          quizSubmitBtn.style.display = "none"
          quizNextBtn.style.display = "none"
          quizFeedbackEl.textContent = `You scored ${quizScore} out of ${quizData.length}!`
          quizFeedbackEl.classList.add(quizScore >= quizData.length / 2 ? "correct" : "incorrect")
          quizScoreEl.style.display = "block"
          currentScoreEl.textContent = quizScore
          totalQuestionsEl.textContent = quizData.length
        }
      }

      if (quizSubmitBtn) {
        quizSubmitBtn.addEventListener("click", () => {
          const selectedOption = quizOptionsEl.querySelector(".selected")
          if (selectedOption) {
            const userAnswer = selectedOption.textContent
            const correctAnswer = quizData[currentQuizQuestionIndex].answer

            Array.from(quizOptionsEl.children).forEach((btn) => {
              btn.disabled = true // Disable all options after submission
              if (btn.textContent === correctAnswer) {
                btn.classList.add("correct")
              } else if (btn.textContent === userAnswer) {
                btn.classList.add("incorrect")
              }
            })

            if (userAnswer === correctAnswer) {
              quizFeedbackEl.textContent = "Correct!"
              quizFeedbackEl.classList.add("correct")
              quizScore++
            } else {
              quizFeedbackEl.textContent = `Incorrect. The answer was: ${correctAnswer}`
              quizFeedbackEl.classList.add("incorrect")
            }
            quizSubmitBtn.style.display = "none"
            quizNextBtn.style.display = "block"
          } else {
            showToast("Please select an answer.", "error")
          }
        })
      }

      if (quizNextBtn) {
        quizNextBtn.addEventListener("click", () => {
          currentQuizQuestionIndex++
          loadQuizQuestion()
        })
      }

      loadQuizQuestion() // Load first quiz question

      // Flashcard Logic
      const flashcardData = [
        { front: "What is Python?", back: "A high-level, interpreted programming language." },
        { front: "What is Java?", back: "A class-based, object-oriented programming language." },
        { front: "What is HTML?", back: "HyperText Markup Language, for structuring web content." },
        { front: "What is CSS?", back: "Cascading Style Sheets, for styling web pages." },
      ]
      let currentFlashcardIndex = 0

      function loadFlashcard() {
        if (flashcardEl) {
          flashcardEl.classList.remove("flipped")
          flashcardFrontEl.textContent = flashcardData[currentFlashcardIndex].front
          flashcardBackEl.textContent = flashcardData[currentFlashcardIndex].back
        }
      }

      if (flashcardEl) {
        flashcardEl.addEventListener("click", () => {
          flashcardEl.classList.toggle("flipped")
        })
      }

      if (prevFlashcardBtn) {
        prevFlashcardBtn.addEventListener("click", () => {
          currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcardData.length) % flashcardData.length
          loadFlashcard()
        })
      }

      if (nextFlashcardBtn) {
        nextFlashcardBtn.addEventListener("click", () => {
          currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardData.length
          loadFlashcard()
        })
      }

      loadFlashcard() // Load first flashcard
    } else {
      courseDetailContent.innerHTML = `<h1 class="page-title">Course Not Found</h1><p class="page-subtitle">The course you are looking for does not exist.</p><a href="courses.html" class="btn btn-primary">Back to Courses</a>`
    }
  }

  // Books Page Logic
  const bookListContainer = document.getElementById("book-list")
  const bookSearchInput = document.getElementById("book-search")
  const bookCategorySelect = document.getElementById("book-category")
  const noBooksFoundMessage = document.getElementById("no-books-found")

  if (bookListContainer) {
    const allCategories = ["Programming", "Fiction", "Science", "Business"] // Example categories
    allCategories.forEach((category) => {
      const option = document.createElement("option")
      option.value = category
      option.textContent = category
      bookCategorySelect.appendChild(option)
    })

    function renderBooks() {
      const searchTerm = bookSearchInput.value.toLowerCase()
      const selectedCategory = bookCategorySelect.value

      // Fetch books from API or use a predefined list
      const books = [
        {
          id: 1,
          title: "JavaScript: The Good Parts",
          author: "Douglas Crockford",
          category: "Programming",
          price: 1500,
          image: "books/js-good-parts.jpg",
        },
        {
          id: 2,
          title: "Python Crash Course",
          author: "Eric Matthes",
          category: "Programming",
          price: 2000,
          image: "books/python-crash-course.jpg",
        },
        {
          id: 3,
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          category: "Fiction",
          price: 2500,
          image: "books/lord-of-the-rings.jpg",
        },
        {
          id: 4,
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          category: "Science",
          price: 1800,
          image: "books/sapiens.jpg",
        },
        {
          id: 5,
          title: "The Lean Startup",
          author: "Eric Ries",
          category: "Business",
          price: 2200,
          image: "books/lean-startup.jpg",
        },
      ]

      const filteredBooks = books.filter((book) => {
        const matchesSearch =
          book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm)
        const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
        return matchesSearch && matchesCategory
      })

      bookListContainer.innerHTML = ""
      if (filteredBooks.length === 0) {
        noBooksFoundMessage.style.display = "block"
      } else {
        noBooksFoundMessage.style.display = "none"
        filteredBooks.forEach((book) => {
          const bookCard = document.createElement("div")
          bookCard.classList.add("card", "book-card")
          bookCard.innerHTML = `
            <img src="${book.image}" alt="${book.title}" class="book-image">
            <h3>${book.title}</h3>
            <p>by ${book.author}</p>
            <p class="book-price">$${(book.price / 100).toFixed(2)}</p>
            <button class="btn btn-primary add-to-cart-btn" data-book-id="${book.id}">Add to Cart</button>
          `
          bookListContainer.appendChild(bookCard)
        })

        // Add event listeners for "Add to Cart" buttons
        document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
          button.addEventListener("click", (e) => {
            const bookId = Number.parseInt(e.target.dataset.bookId)
            const bookToAdd = books.find((b) => b.id === bookId)
            if (bookToAdd) {
              const cart = JSON.parse(localStorage.getItem("smkt_cart") || "[]")
              const existingItem = cart.find((item) => item.id === bookId)

              if (existingItem) {
                existingItem.quantity++
              } else {
                cart.push({ ...bookToAdd, quantity: 1 })
              }
              localStorage.setItem("smkt_cart", JSON.stringify(cart))
              showToast(`"${bookToAdd.title}" added to cart!`, "success")
              // Update dashboard stat immediately
              localStorage.setItem("smkt_cartItemsCount", cart.length)
            }
          })
        })
      }
    }

    bookSearchInput.addEventListener("input", renderBooks)
    bookCategorySelect.addEventListener("change", renderBooks)

    renderBooks() // Initial render
  }

  // Cart Page Logic
  const cartItemsContainer = document.getElementById("cart-items-container")
  const cartTotalPriceEl = document.getElementById("cart-total-price")
  const emptyCartMessage = document.getElementById("empty-cart-message")
  const checkoutBtn = document.getElementById("checkout-btn")

  if (cartItemsContainer) {
    function updateCartDisplay() {
      const cart = JSON.parse(localStorage.getItem("smkt_cart") || "[]")
      cartItemsContainer.innerHTML = ""
      let totalPrice = 0

      if (cart.length === 0) {
        emptyCartMessage.style.display = "block"
        checkoutBtn.disabled = true
      } else {
        emptyCartMessage.style.display = "none"
        checkoutBtn.disabled = false
        cart.forEach((item) => {
          const itemTotal = item.price * item.quantity
          totalPrice += itemTotal

          const cartItemEl = document.createElement("div")
          cartItemEl.classList.add("cart-item")
          cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>by ${item.author}</p>
                <p>Price: $${(item.price / 100).toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="decrease-quantity-btn" data-id="${item.id}">-</button>
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
                <button class="increase-quantity-btn" data-id="${item.id}">+</button>
            </div>
            <span class="cart-item-price">$${(itemTotal / 100).toFixed(2)}</span>
            <button class="remove-item-btn" data-id="${item.id}">&times;</button>
          `
          cartItemsContainer.appendChild(cartItemEl)
        })
      }

      cartTotalPriceEl.textContent = `$${(totalPrice / 100).toFixed(2)}`
      localStorage.setItem("smkt_cartItemsCount", cart.length) // Update dashboard count

      // Add event listeners for quantity and remove buttons
      document.querySelectorAll(".decrease-quantity-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.dataset.id)
          const cart = JSON.parse(localStorage.getItem("smkt_cart") || "[]")
          const item = cart.find((i) => i.id === id)
          if (item && item.quantity > 1) {
            item.quantity--
            localStorage.setItem("smkt_cart", JSON.stringify(cart))
            updateCartDisplay()
          }
        })
      })

      document.querySelectorAll(".increase-quantity-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.dataset.id)
          const cart = JSON.parse(localStorage.getItem("smkt_cart") || "[]")
          const item = cart.find((i) => i.id === id)
          if (item) {
            item.quantity++
            localStorage.setItem("smkt_cart", JSON.stringify(cart))
            updateCartDisplay()
          }
        })
      })

      document.querySelectorAll(".quantity-input").forEach((input) => {
        input.addEventListener("change", (e) => {
          const id = Number.parseInt(e.target.dataset.id)
          const newQuantity = Number.parseInt(e.target.value)
          let cart = JSON.parse(localStorage.getItem("smkt_cart") || "[]")
          const item = cart.find((i) => i.id === id)
          if (item && newQuantity >= 1) {
            item.quantity = newQuantity
            localStorage.setItem("smkt_cart", JSON.stringify(cart))
            updateCartDisplay()
          } else if (item && newQuantity < 1) {
            // If quantity goes below 1, remove item
            cart = cart.filter((i) => i.id !== id)
            localStorage.setItem("smkt_cart", JSON.stringify(cart))
            updateCartDisplay()
          }
        })
      })

      document.querySelectorAll(".remove-item-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.dataset.id)
          let cart = JSON.parse(localStorage.getItem("smkt_cart") || "[]")
          cart = cart.filter((item) => item.id !== id)
          localStorage.setItem("smkt_cart", JSON.stringify(cart))
          showToast("Item removed from cart.", "info")
          updateCartDisplay()
        })
      })
    }

    updateCartDisplay() // Initial render for cart page
  }

  // Checkout Page Logic
  const checkoutForm = document.getElementById("checkout-form")
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const cardNameInput = document.getElementById("card-name")
      const cardNumberInput = document.getElementById("card-number")
      const expiryDateInput = document.getElementById("expiry-date")
      const cvvInput = document.getElementById("cvv")

      let isValid = true

      if (cardNameInput.value.trim() === "") {
        showError(cardNameInput, "Name on card is required.")
        isValid = false
      } else {
        clearError(cardNameInput)
      }

      if (!validateCardNumber(cardNumberInput.value)) {
        showError(cardNumberInput, "Please enter a valid 16-digit card number.")
        isValid = false
      } else {
        clearError(cardNumberInput)
      }

      if (!validateExpiryDate(expiryDateInput.value)) {
        showError(expiryDateInput, "Please enter a valid MM/YY expiry date.")
        isValid = false
      } else {
        clearError(expiryDateInput)
      }

      if (!validateCVV(cvvInput.value)) {
        showError(cvvInput, "Please enter a valid 3 or 4 digit CVV.")
        isValid = false
      } else {
        clearError(cvvInput)
      }

      if (isValid) {
        // Simulate payment success
        showToast("Payment successful! Redirecting to order confirmation...", "success")
        localStorage.removeItem("smkt_cart") // Clear cart after successful checkout
        localStorage.setItem("smkt_cartItemsCount", "0") // Reset cart count
        setTimeout(() => {
          // In a real app, you'd pass order details. Here, just redirect.
          window.location.href = "index.html" // Redirect to home or a dedicated order confirmation page
        }, 1500)
      } else {
        showToast("Please correct the errors in the form.", "error")
      }
    })
  }

  // Contact Page Logic
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const nameInput = document.getElementById("contact-name")
      const emailInput = document.getElementById("contact-email")
      const messageInput = document.getElementById("contact-message")

      let isValid = true

      if (nameInput.value.trim() === "") {
        showError(nameInput, "Name is required.")
        isValid = false
      } else {
        clearError(nameInput)
      }

      if (!validateEmail(emailInput.value)) {
        showError(emailInput, "Please enter a valid email address.")
        isValid = false
      } else {
        clearError(emailInput)
      }

      if (messageInput.value.trim() === "") {
        showError(messageInput, "Message cannot be empty.")
        isValid = false
      } else {
        clearError(messageInput)
      }

      if (isValid) {
        showToast("Message sent successfully! We'll get back to you soon.", "success")
        contactForm.reset() // Clear the form
        // Manually reset floating labels for cleared inputs
        nameInput.classList.remove("has-content")
        emailInput.classList.remove("has-content")
        messageInput.classList.remove("has-content")
      } else {
        showToast("Please correct the errors in the form.", "error")
      }
    })
  }
})
