const menuToggle = document.getElementById("menuToggle")
const navMenu = document.querySelector(".nav-menu")
const navLinks = document.querySelectorAll(".nav-link")

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  menuToggle.classList.toggle("active")
})

// Close menu when a link is clicked
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    menuToggle.classList.remove("active")
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  navLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })

  animateStatNumbers()
})

function animateStatNumbers() {
  const statNumbers = document.querySelectorAll(".stat-number")

  statNumbers.forEach((stat) => {
    const finalValue = stat.textContent
    const numericValue = Number.parseInt(finalValue)

    if (!isNaN(numericValue)) {
      const startValue = 0
      const duration = 2000 // 2 seconds
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const currentValue = Math.floor(startValue + numericValue * progress)

        stat.textContent = currentValue + (finalValue.includes("%") ? "%" : finalValue.includes("+") ? "+" : "")

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      // Start animation when element comes into view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate()
              observer.unobserve(stat)
            }
          })
        },
        { threshold: 0.5 },
      )

      observer.observe(stat)
    }
  })
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe cards for animation
const cardsToAnimate = document.querySelectorAll(
  ".stat-card, .program-card, .news-card, .team-card, " +
    ".formation-card, .spec-item, .research-card, .career-card, .faq-item",
)

cardsToAnimate.forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(20px)"
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(el)
})

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimized scroll handler
const handleScroll = debounce(() => {
  const scrolled = window.scrollY
  const header = document.querySelector(".header")

  if (scrolled > 50) {
    header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
  } else {
    header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)"
  }
}, 10)

window.addEventListener("scroll", handleScroll)

// Skip to main content link (accessibility)
const body = document.body
const skipLink = document.createElement("a")
skipLink.href = "#main-content"
skipLink.textContent = "Aller au contenu principal"
skipLink.className = "sr-only"
skipLink.id = "skip-link"
body.insertBefore(skipLink, body.firstChild)
