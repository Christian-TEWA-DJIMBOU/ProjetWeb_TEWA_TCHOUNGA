// Contact Form Handler
const contactForm = document.getElementById("contactForm")
const formNotice = document.getElementById("formNotice")

// Enhanced form validation with better error messages
function validateForm(formData) {
  const errors = {}

  if (!formData.name.trim()) {
    errors.name = "Le nom est obligatoire"
  }

  if (!formData.email.trim()) {
    errors.email = "L'email est obligatoire"
  } else if (!validateEmail(formData.email)) {
    errors.email = "Veuillez entrer une adresse email valide"
  }

  if (!formData.subject) {
    errors.subject = "Veuillez sélectionner un sujet"
  }

  if (!formData.message.trim()) {
    errors.message = "Le message est obligatoire"
  }

  return errors
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  }

  const errors = validateForm(formData)

  if (Object.keys(errors).length > 0) {
    formNotice.textContent = Object.values(errors)[0]
    formNotice.classList.add("error")
    formNotice.classList.remove("success")
    return
  }

  // Simulate form submission
  console.log("[v0] Form submitted with valid data:", formData)

  formNotice.textContent = "Merci! Votre message a été envoyé avec succès. Nous vous répondrons très bientôt."
  formNotice.classList.add("success")
  formNotice.classList.remove("error")

  contactForm.reset()

  // Clear message after 5 seconds
  setTimeout(() => {
    formNotice.textContent = ""
  }, 5000)
})
