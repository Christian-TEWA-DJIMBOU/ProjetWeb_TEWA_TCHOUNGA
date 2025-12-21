// script.js
//
// Ce fichier centralise les fonctionnalités JavaScript pour les pages du département
// informatique d'EFREI. Il gère la navigation mobile, l'animation du carrousel et
// des indicateurs, l'interactivité des sections programmes et équipe, la validation
// du formulaire de contact et le chatbot de la page de contact.

document.addEventListener('DOMContentLoaded', () => {
  /*--------------------------------------
   * Menu burger (navigation responsive)
   *--------------------------------------*/
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  /*--------------------------------------
   * Carrousel automatique sur la page d'accueil
   *--------------------------------------*/
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    const slides = carousel.querySelectorAll('.slide');
    let current = 0;
    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };
    const next = () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    };
    // Lancement de la rotation automatique toutes les 5 s
    setInterval(next, 5000);
  }

  /*--------------------------------------
   * Animation des indicateurs chiffrés (Accueil.html)
   *--------------------------------------*/
  const kpiElements = document.querySelectorAll('.stat-kpi');
  if (kpiElements.length) {
    kpiElements.forEach((el) => {
      const text = el.textContent.trim();
      // Extraire les chiffres pour l'animation
      const match = text.match(/\d+/g);
      if (!match) return;
      const target = parseInt(match.join(''), 10);
      const suffix = text.replace(/\d+/g, '');
      let count = 0;
      const increment = Math.ceil(target / 200);
      const updateCounter = () => {
        if (count < target) {
          count += increment;
          el.textContent = (count > target ? target : count) + suffix;
          setTimeout(updateCounter, 20);
        } else {
          el.textContent = target + suffix;
        }
      };
      updateCounter();
    });
  }

  /*--------------------------------------
   * Dépliez/repliez les sections programmes (formations.html)
   *--------------------------------------*/
  const programHeaders = document.querySelectorAll('.program-section__header');
  if (programHeaders.length) {
    programHeaders.forEach((header) => {
      header.style.cursor = 'pointer';
      header.addEventListener('click', () => {
        const section = header.closest('.program-section');
        if (!section) return;
        const grid = section.querySelector('.program-grid');
        if (!grid) return;
        // basculer l'affichage
        if (grid.style.display === 'none') {
          grid.style.display = '';
        } else {
          grid.style.display = 'none';
        }
      });
    });
  }

  /*--------------------------------------
   * Afficher/masquer les détails des cartes (equipe.html)
   *--------------------------------------*/
  const teamCards = document.querySelectorAll('.card');
  if (teamCards.length) {
    teamCards.forEach((card) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const paragraphs = card.querySelectorAll('p');
        paragraphs.forEach((p) => {
          // basculer la visibilité
          if (p.style.display === 'none') {
            p.style.display = '';
          } else {
            p.style.display = 'none';
          }
        });
      });
    });
  }

  /*--------------------------------------
   * Validation du formulaire de contact (conctact.html)
   *--------------------------------------*/
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('nom');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const feedback = document.getElementById('formFeedback');
      let valid = true;
      [nameInput, emailInput, messageInput].forEach((input) => {
        if (!input.value.trim()) {
          input.style.borderColor = 'red';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (!valid) {
        feedback.textContent = 'Veuillez remplir tous les champs requis.';
        feedback.style.color = '#c0392b';
      } else {
        feedback.textContent = 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.';
        feedback.style.color = '#27ae60';
        contactForm.reset();
      }
    });
  }

  /*--------------------------------------
   * Chatbot flottant (conctact.html)
   *--------------------------------------*/
  const chatbotWidget = document.getElementById('chatbotWidget');
  if (chatbotWidget) {
    const toggleBtn = chatbotWidget.querySelector('#chatbotToggle');
    const panel = chatbotWidget.querySelector('#chatbotPanel');
    const closeBtn = chatbotWidget.querySelector('#chatbotClose');
    const messagesContainer = chatbotWidget.querySelector('#chatbotMessages');
    const quickContainer = chatbotWidget.querySelector('#chatbotQuick');
    const form = chatbotWidget.querySelector('#chatbotForm');
    const input = chatbotWidget.querySelector('#chatbotInput');
    let chatbotData = [];
    // Charger les données depuis l'attribut data-chatbot
    const dataPath = chatbotWidget.getAttribute('data-chatbot');
    fetch(dataPath)
      .then((resp) => {
        if (!resp.ok) throw new Error('Network error');
        return resp.json();
      })
      .then((data) => {
        chatbotData = data.messages || [];
        initQuickReplies();
      })
      .catch(() => {
        console.warn('Utilisation de réponses par défaut pour le chatbot');
        chatbotData = [
          {
            keywords: ['bonjour', 'salut', 'hello'],
            response: "Bonjour ! Comment puis‑je vous aider aujourd'hui ?"
          },
          {
            keywords: ['services', 'formation', 'offre'],
            response: "Nos formations couvrent des domaines variés comme l'IA, la cybersécurité, la data et bien plus. Visitez la page Formations pour tous les détails."
          },
          {
            keywords: ['adresse', 'contact', 'email'],
            response: "Vous pouvez nous contacter à info@efrei.fr ou via le formulaire de contact de cette page."
          },
          {
            keywords: ['devis', 'tarif', 'prix'],
            response: "Pour toute demande personnalisée, précisez votre question et notre équipe vous répondra rapidement."
          },
          {
            keywords: ['merci', 'thanks'],
            response: "Merci à vous ! Nous restons à votre disposition."
          }
        ];
        initQuickReplies();
      });
    // fonctions pour afficher/masquer le panneau
    const openPanel = () => {
      panel.removeAttribute('hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
    };
    const closePanel = () => {
      panel.setAttribute('hidden', '');
      toggleBtn.setAttribute('aria-expanded', 'false');
    };
    toggleBtn.addEventListener('click', () => {
      if (panel.hasAttribute('hidden')) {
        openPanel();
      } else {
        closePanel();
      }
    });
    closeBtn.addEventListener('click', () => {
      closePanel();
    });
    // Ajouter un message
    const addMessage = (text, sender) => {
      const msg = document.createElement('div');
      msg.className = 'chatbot__msg chatbot__msg--' + sender;
      const bubble = document.createElement('div');
      bubble.className = 'chatbot__bubble';
      bubble.textContent = text;
      msg.appendChild(bubble);
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    // Obtenir la réponse
    const getReply = (text) => {
      const lower = text.toLowerCase();
      let reply = null;
      chatbotData.forEach((entry) => {
        entry.keywords.forEach((kw) => {
          if (!reply && lower.includes(kw.toLowerCase())) {
            reply = entry.response;
          }
        });
      });
      return reply || "Je suis désolé, je n'ai pas compris votre question. Pouvez‑vous préciser votre demande ?";
    };
    // envoyer un message utilisateur
    const handleUserMessage = (text) => {
      addMessage(text, 'user');
      const response = getReply(text);
      setTimeout(() => {
        addMessage(response, 'bot');
      }, 500);
    };
    // suggestions rapides
    const initQuickReplies = () => {
      if (!quickContainer) return;
      quickContainer.innerHTML = '';
      const keys = chatbotData.map((entry) => entry.keywords[0]).slice(0, 5);
      keys.forEach((kw) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chatbot__chip';
        chip.textContent = kw;
        chip.addEventListener('click', () => {
          handleUserMessage(kw);
        });
        quickContainer.appendChild(chip);
      });
    };
    // événement formulaire
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = input.value.trim();
      if (!userText) return;
      handleUserMessage(userText);
      input.value = '';
    });
  }
});


/* =====================================================
   CHATBOT – ouverture / fermeture + messages
   ===================================================== */

const chatbotWidget = document.getElementById("chatbotWidget");
const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotPanel = document.getElementById("chatbotPanel");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotMessages = document.getElementById("chatbotMessages");
const chatbotForm = document.getElementById("chatbotForm");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotQuick = document.getElementById("chatbotQuick");

let chatbotData = [];

/* ---------- État initial ---------- */
if (chatbotPanel) {
  chatbotPanel.hidden = true; // fermé par défaut
}

/* ---------- OUVRIR le chatbot ---------- */
if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener("click", () => {
    chatbotPanel.hidden = false;
    chatbotToggle.setAttribute("aria-expanded", "true");
    chatbotInput?.focus();
  });
}

/* ---------- FERMER le chatbot ---------- */
if (chatbotClose && chatbotPanel) {
  chatbotClose.addEventListener("click", () => {
    chatbotPanel.hidden = true;
    chatbotToggle.setAttribute("aria-expanded", "false");
  });
}

/* ---------- Charger les données JSON ---------- */
if (chatbotWidget) {
  const dataPath = chatbotWidget.dataset.chatbot;

  fetch(dataPath)
    .then(res => res.json())
    .then(data => {
      chatbotData = data.messages || [];
      showBotMessage("Bonjour 👋 Je suis l’assistant EFREI. Pose-moi une question !");
      renderQuickReplies();
    })
    .catch(() => {
      // Fallback si JSON non chargé
      chatbotData = [
        {
          keywords: ["bonjour", "salut", "hello"],
          response: "Bonjour 👋 Comment puis-je vous aider ?"
        },
        {
          keywords: ["formations", "programmes"],
          response: "Nous proposons des formations en informatique, data, cybersécurité et IA."
        },
        {
          keywords: ["contact", "email"],
          response: "Vous pouvez nous contacter via le formulaire ou à info@efrei.fr."
        }
      ];
      showBotMessage("Bonjour 👋 Je suis l’assistant EFREI.");
      renderQuickReplies();
    });
}

/* ---------- Envoi message utilisateur ---------- */
chatbotForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatbotInput.value.trim();
  if (!text) return;

  showUserMessage(text);
  chatbotInput.value = "";

  setTimeout(() => {
    respondToUser(text);
  }, 500);
});

/* ---------- Fonctions utilitaires ---------- */

function showUserMessage(text) {
  chatbotMessages.innerHTML += `
    <div class="chatbot__msg chatbot__msg--user">
      <div class="chatbot__bubble">${text}</div>
    </div>`;
  scrollChat();
}

function showBotMessage(text) {
  chatbotMessages.innerHTML += `
    <div class="chatbot__msg chatbot__msg--bot">
      <div class="chatbot__bubble">${text}</div>
    </div>`;
  scrollChat();
}

function respondToUser(text) {
  const msg = text.toLowerCase();

  for (const item of chatbotData) {
    if (item.keywords.some(k => msg.includes(k))) {
      showBotMessage(item.response);
      return;
    }
  }

  showBotMessage(
    "Je n’ai pas encore la réponse 😅. Tu peux demander : formations, admissions, contact."
  );
}

function scrollChat() {
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/* ---------- Boutons questions rapides ---------- */
function renderQuickReplies() {
  if (!chatbotQuick) return;

  chatbotQuick.innerHTML = "";
  const quickQuestions = ["Formations", "Admissions", "Contact"];

  quickQuestions.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "chatbot__chip";
    btn.textContent = q;
    btn.onclick = () => {
      showUserMessage(q);
      respondToUser(q);
    };
    chatbotQuick.appendChild(btn);
  });
}
