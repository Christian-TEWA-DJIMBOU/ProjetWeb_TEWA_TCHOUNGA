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
      const prefixMatch = text.match(/^[^0-9]+/);
      const suffixMatch = text.match(/[^0-9]+$/);
      const prefix = prefixMatch ? prefixMatch[0] : '';
      const suffix = suffixMatch ? suffixMatch[0] : '';
      let count = 0;
      const increment = Math.ceil(target / 200);
      const updateCounter = () => {
        if (count < target) {
          count += increment;
          el.textContent = prefix + (count > target ? target : count) + suffix;
          setTimeout(updateCounter, 20);
        } else {
          el.textContent = prefix + target + suffix;
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
  const legacyTeamGrid = document.getElementById('teamGrid');
  const teamCards = legacyTeamGrid ? legacyTeamGrid.querySelectorAll('.card') : [];
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
   * Carrousel professeurs (equipe.html)
   *--------------------------------------*/
  const teacherTrack = document.getElementById('teacherTrack');
  if (teacherTrack) {
    const btnPrev = document.querySelector('[data-carousel-prev]');
    const btnNext = document.querySelector('[data-carousel-next]');
    let autoplayId = null;

    const flipButtons = teacherTrack.querySelectorAll('.flip-card-front, .flip-card-back');
    if (flipButtons.length) {
      flipButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const flipCard = btn.closest('.flip-card');
          if (!flipCard) return;
          flipCard.classList.toggle('is-flipped');
        });

        btn.addEventListener('keydown', (e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          e.stopPropagation();
          const flipCard = btn.closest('.flip-card');
          if (!flipCard) return;
          flipCard.classList.toggle('is-flipped');
        });
      });
    }

    const getScrollStep = () => {
      const firstCard = teacherTrack.querySelector('.teacher-card');
      const style = window.getComputedStyle(teacherTrack);
      const gap = parseInt(style.gap || '16', 10) || 16;
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 300;
      return Math.round(cardWidth + gap);
    };

    const isAtEnd = () => {
      return Math.ceil(teacherTrack.scrollLeft + teacherTrack.clientWidth) >= teacherTrack.scrollWidth;
    };

    const scrollByStep = (direction) => {
      const step = getScrollStep();
      teacherTrack.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    const goToStart = () => {
      teacherTrack.scrollTo({ left: 0, behavior: 'smooth' });
    };

    const stopAutoplay = () => {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayId = setInterval(() => {
        if (isAtEnd()) {
          goToStart();
        } else {
          scrollByStep(1);
        }
      }, 3200);
    };

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        stopAutoplay();
        scrollByStep(-1);
        startAutoplay();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        stopAutoplay();
        if (isAtEnd()) {
          goToStart();
        } else {
          scrollByStep(1);
        }
        startAutoplay();
      });
    }

    teacherTrack.addEventListener('mouseenter', () => stopAutoplay());
    teacherTrack.addEventListener('mouseleave', () => startAutoplay());
    teacherTrack.addEventListener('focusin', () => stopAutoplay());
    teacherTrack.addEventListener('focusout', () => startAutoplay());

    teacherTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stopAutoplay();
        scrollByStep(-1);
        startAutoplay();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stopAutoplay();
        scrollByStep(1);
        startAutoplay();
      }
    });

    startAutoplay();
  }

  const teamGrid = document.getElementById('teamGrid');
  const teamSearch = document.getElementById('teamSearch');
  const teamEmpty = document.getElementById('teamEmpty');
  const teamModal = document.getElementById('teamModal');
  const teamModalBody = document.getElementById('teamModalBody');
  const teamFilterButtons = document.querySelectorAll('.team-filter');

  if (teamGrid) {
    const teamMembers = [
      {
        id: 'dupont',
        name: 'Dr. Michel Dupont',
        title: 'Enseignant‑chercheur',
        domain: 'ia',
        speciality: 'Intelligence Artificielle',
        bio: "Spécialiste en IA et Machine Learning, avec une approche orientée produit et recherche appliquée.",
        tags: ['Machine Learning', 'Deep Learning', 'IA responsable'],
        courses: ['IA & Machine Learning', 'Projet IA', 'MLOps (intro)'],
        research: ['Robustesse des modèles', 'Explicabilité', 'NLP & classification'],
        email: 'michel.dupont@efrei.fr'
      },
      {
        id: 'bernard',
        name: 'Dr. Sarah Bernard',
        title: 'Responsable pédagogique sécurité',
        domain: 'cyber',
        speciality: 'Cybersécurité',
        bio: "Experte en cybersécurité, audit et protection des données. Intervient sur les volets défensifs et gouvernance.",
        tags: ['Cryptographie', 'SOC', 'Sécurité Cloud'],
        courses: ['Sécurité des SI', 'Audit & conformité', 'Atelier CTF'],
        research: ['Détection d’intrusions', 'Privacy by design', 'Threat modeling'],
        email: 'sarah.bernard@efrei.fr'
      },
      {
        id: 'moreau',
        name: 'Dr. Pierre Moreau',
        title: 'Intervenant expert',
        domain: 'web',
        speciality: 'Développement Web',
        bio: "Expert en architectures web modernes et industrialisation (CI/CD). Accompagne les projets full‑stack.",
        tags: ['Full‑stack', 'API', 'DevOps'],
        courses: ['Web avancé', 'Architecture logicielle', 'CI/CD'],
        research: ['Qualité logicielle', 'Microservices', 'Observabilité'],
        email: 'pierre.moreau@efrei.fr'
      },
      {
        id: 'leclerc',
        name: 'Dr. Anne Leclerc',
        title: 'Enseignante‑chercheuse',
        domain: 'data',
        speciality: 'Big Data',
        bio: "Spécialiste du traitement des données massives, de la gouvernance data et de la mise en production des pipelines.",
        tags: ['Big Data', 'Spark', 'Data Quality'],
        courses: ['Data engineering', 'Traitement distribué', 'Projet data'],
        research: ['Data observability', 'Feature stores', 'Optimisation des pipelines'],
        email: 'anne.leclerc@efrei.fr'
      },
      {
        id: 'leblanc',
        name: 'Dr. Jean Leblanc',
        title: 'Responsable IoT',
        domain: 'iot',
        speciality: 'Systèmes Embarqués',
        bio: "Expert en systèmes embarqués et IoT. Travaille sur l’edge, le temps réel et la sécurité des objets connectés.",
        tags: ['IoT', 'Embedded', 'Robotique'],
        courses: ['Systèmes embarqués', 'IoT & edge', 'Robotique'],
        research: ['Sécurité embarquée', 'Edge analytics', 'Optimisation énergétique'],
        email: 'jean.leblanc@efrei.fr'
      },
      {
        id: 'martin',
        name: 'Dr. Céline Martin',
        title: 'Experte cloud',
        domain: 'cloud',
        speciality: 'Cloud Computing',
        bio: "Architecte cloud certifiée. Accompagne les sujets de déploiement, conteneurs, sécurité et fiabilité.",
        tags: ['AWS', 'Kubernetes', 'Architecture'],
        courses: ['Cloud computing', 'Containers & Kubernetes', 'SRE (intro)'],
        research: ['MLOps', 'FinOps', 'Fiabilité des systèmes'],
        email: 'celine.martin@efrei.fr'
      },
      {
        id: 'diallo',
        name: 'Dr. Aïssatou Diallo',
        title: 'Enseignante‑chercheuse',
        domain: 'ia',
        speciality: 'Vision & IA embarquée',
        bio: "Travaille sur la vision par ordinateur et les modèles légers déployés en edge/IoT.",
        tags: ['Vision', 'Edge AI', 'Optimisation'],
        courses: ['Vision par ordinateur', 'IA embarquée', 'Projet vision'],
        research: ['Compression de modèles', 'Détection temps réel', 'Datasets & biais'],
        email: 'aissatou.diallo@efrei.fr'
      },
      {
        id: 'nguyen',
        name: 'Dr. Minh Nguyen',
        title: 'Intervenant expert',
        domain: 'cyber',
        speciality: 'Sécurité applicative',
        bio: "Spécialiste sécurité applicative : analyse de code, pentest, durcissement et sécurisation des APIs.",
        tags: ['Pentest', 'OWASP', 'Sécurité API'],
        courses: ['Sécurité applicative', 'Pentest (atelier)', 'Secure coding'],
        research: ['Détection de vulnérabilités', 'Supply chain', 'Sécurité CI/CD'],
        email: 'minh.nguyen@efrei.fr'
      }
    ];

    let activeFilter = 'all';
    let lastFocusedElement = null;

    const getInitials = (name) => {
      const cleaned = name.replace(/Dr\./g, '').trim();
      const parts = cleaned.split(/\s+/).filter(Boolean);
      const first = parts[0] ? parts[0][0] : '';
      const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
      return (first + last).toUpperCase();
    };

    const normalize = (value) => (value || '').toString().toLowerCase();

    const matchesFilter = (member) => {
      if (activeFilter === 'all') return true;
      return member.domain === activeFilter;
    };

    const matchesSearch = (member, query) => {
      if (!query) return true;
      const haystack = [
        member.name,
        member.title,
        member.speciality,
        member.bio,
        ...(member.tags || []),
        ...(member.courses || []),
        ...(member.research || [])
      ]
        .map((v) => normalize(v))
        .join(' ');
      return haystack.includes(query);
    };

    const clearGrid = () => {
      while (teamGrid.firstChild) teamGrid.removeChild(teamGrid.firstChild);
    };

    const renderTag = (text) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = text;
      return span;
    };

    const renderCard = (member) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'team-card';
      btn.dataset.teamId = member.id;

      const top = document.createElement('div');
      top.className = 'team-card__top';

      const avatar = document.createElement('div');
      avatar.className = 'team-avatar';
      avatar.textContent = getInitials(member.name);

      const info = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.className = 'team-card__name';
      h3.textContent = member.name;

      const title = document.createElement('p');
      title.className = 'team-card__title';
      title.textContent = member.speciality;

      info.appendChild(h3);
      info.appendChild(title);

      top.appendChild(avatar);
      top.appendChild(info);

      const bio = document.createElement('p');
      bio.className = 'team-card__bio';
      bio.textContent = member.bio;

      const tags = document.createElement('div');
      tags.className = 'team-card__tags';
      (member.tags || []).slice(0, 4).forEach((t) => tags.appendChild(renderTag(t)));

      btn.appendChild(top);
      btn.appendChild(bio);
      btn.appendChild(tags);

      btn.addEventListener('click', () => openMemberModal(member));
      return btn;
    };

    const renderList = () => {
      const query = normalize(teamSearch ? teamSearch.value.trim() : '');
      const results = teamMembers.filter((m) => matchesFilter(m) && matchesSearch(m, query));
      clearGrid();
      results.forEach((member) => teamGrid.appendChild(renderCard(member)));
      if (teamEmpty) {
        teamEmpty.hidden = results.length !== 0;
      }
    };

    const buildModalContent = (member) => {
      const tagsHtml = (member.tags || []).map((t) => `<span class="tag">${t}</span>`).join(' ');
      const coursesHtml = (member.courses || []).map((c) => `<li>${c}</li>`).join('');
      const researchHtml = (member.research || []).map((r) => `<li>${r}</li>`).join('');
      const email = member.email ? `<a class="btn-primary" href="mailto:${member.email}">Contacter</a>` : '';

      return `
        <div class="team-modalHeader">
          <div class="team-avatar">${getInitials(member.name)}</div>
          <div>
            <h2>${member.name}</h2>
            <p class="team-modalMeta">${member.title} · ${member.speciality}</p>
            <div class="team-card__tags">${tagsHtml}</div>
          </div>
        </div>
        <div class="team-modalGrid">
          <div class="team-modalBlock">
            <h3>À propos</h3>
            <p>${member.bio}</p>
          </div>
          <div class="team-modalBlock">
            <h3>Cours & encadrement</h3>
            <ul>${coursesHtml}</ul>
          </div>
          <div class="team-modalBlock">
            <h3>Recherche & sujets</h3>
            <ul>${researchHtml}</ul>
          </div>
        </div>
        <div class="team-modalActions">
          ${email}
          <a class="btn-link" href="#collaborer">Proposer un projet</a>
        </div>
      `;
    };

    const closeMemberModal = () => {
      if (!teamModal) return;
      teamModal.hidden = true;
      document.body.classList.remove('no-scroll');
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
      lastFocusedElement = null;
    };

    const openMemberModal = (member) => {
      if (!teamModal || !teamModalBody) return;
      lastFocusedElement = document.activeElement;
      teamModalBody.innerHTML = buildModalContent(member);
      teamModal.hidden = false;
      document.body.classList.add('no-scroll');
      const closeButton = teamModal.querySelector('.team-modal__close');
      closeButton?.focus();
    };

    teamFilterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        teamFilterButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeFilter = btn.getAttribute('data-team-filter') || 'all';
        renderList();
      });
    });

    teamSearch?.addEventListener('input', () => renderList());

    teamModal?.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.hasAttribute('data-team-modal-close')) {
        closeMemberModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && teamModal && !teamModal.hidden) {
        closeMemberModal();
      }
    });

    renderList();
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
  // Remarque : La logique complète du chatbot est désormais définie en dehors
  // de ce gestionnaire DOMContentLoaded pour éviter des conflits et doublons.
  // Nous désactivons donc ici l’implémentation d’origine en forçant la
  // condition à false. Le code du chatbot situé après cet écouteur
  // gère l’ouverture/fermeture et les réponses.
  const chatbotWidget = document.getElementById('chatbotWidget');
  if (false && chatbotWidget) {
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
