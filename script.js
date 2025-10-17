const navLinks = document.querySelectorAll('header nav a');
const logoLink = document.querySelector('.logo');
const sections = document.querySelectorAll('section');
const header = document.querySelector('header');
const sobreBtns = document.querySelectorAll('.sobre-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item'); 
const timelineItems = document.querySelectorAll('.timeline-item'); 
const portfolioVideos = document.querySelectorAll('.portfolio-video video'); 

const headerHeight = header.offsetHeight;

const scrollToSection = (targetId) => {
  const targetSection = document.getElementById(targetId);
  
  if (targetSection) {
    const offsetTop = targetSection.offsetTop - headerHeight;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
    pauseAllVideos(); 
    if (targetId === 'sobre') {
      activateSobreMimDefault();
      const experienciasDetalhe = document.getElementById('experiencias-detalhe');
      if (experienciasDetalhe && experienciasDetalhe.classList.contains('active')) {
          setTimeout(animateTimelineItems, 50); 
      }
    }
  }
};

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    scrollToSection(targetId);
  });
});

logoLink.addEventListener('click', (e) => {
  e.preventDefault();
  scrollToSection('home');
});
const activateNavLinkOnScroll = () => {
  const scrollPos = window.scrollY + headerHeight + 1;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`header nav a[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
      if (sectionId === 'sobre') {
        const experienciasDetalhe = document.getElementById('experiencias-detalhe');
        if (experienciasDetalhe && experienciasDetalhe.classList.contains('active')) {
            animateTimelineItems(); 
        }
      }
    }
    // Play do video
    if (sectionId !== 'portfolio' && (scrollPos < sectionTop || scrollPos >= sectionTop + sectionHeight)) {
        const videosInSection = section.querySelectorAll('video');
        videosInSection.forEach(video => {
            if (!video.paused) {
                video.pause();
            }
        });
    }
  });
};

// --- sobre ---
sobreBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sobreBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); // Ativa o botão clicado   
    const targetDetalheId = btn.getAttribute('data-target');
    document.querySelectorAll('.sobre-detalhe').forEach(d => d.classList.remove('active'));
    const targetDetalhe = document.getElementById(targetDetalheId);
    if (targetDetalhe) {
      targetDetalhe.classList.add('active'); 
      if (targetDetalheId === 'experiencias-detalhe') {
          timelineItems.forEach(item => item.classList.remove('fade-in'));
          setTimeout(animateTimelineItems, 50); 
      }
    }
  });
});
const activateSobreMimDefault = () => {
  const defaultSobreMimBtn = document.querySelector('.sobre-btn[data-target="sobre-mim-detalhe"]');
  if (defaultSobreMimBtn && !defaultSobreMimBtn.classList.contains('active')) {
    sobreBtns.forEach(b => b.classList.remove('active'));
    defaultSobreMimBtn.classList.add('active');
    document.querySelectorAll('.sobre-detalhe').forEach(d => d.classList.remove('active'));
    const defaultDetalhe = document.getElementById('sobre-mim-detalhe');
    if (defaultDetalhe) {
      defaultDetalhe.classList.add('active');
    }
  }
};

// --- Linha do tempo da paginaaaaa - logica ---
const animateTimelineItems = () => {
    const experienciasDetalhe = document.getElementById('experiencias-detalhe');
    if (experienciasDetalhe && experienciasDetalhe.classList.contains('active')) {
        timelineItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect(); 
            const windowHeight = window.innerHeight;
            const activationPoint = windowHeight * 0.85; 
            if (itemRect.top < activationPoint && itemRect.bottom > 0) {
                if (!item.classList.contains('fade-in')) {
                    setTimeout(() => {
                        item.classList.add('fade-in');
                    }, index * 150); 
                }
            } else if (itemRect.top > windowHeight || itemRect.bottom < 0) {
                 item.classList.remove('fade-in');
            }
        });
    } else {
        timelineItems.forEach(item => {
            item.classList.remove('fade-in');
        });
    }
};
const setupVideoObservers = () => {
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.5 
    };
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                if (video.paused) {
                    video.play().catch(error => {
                        console.warn("Autoplay bloqueado para vídeo. O usuário precisará interagir.", error);
                    });
                }
            } else {
                const video = entry.target;
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, observerOptions);

    portfolioVideos.forEach(video => {
        videoObserver.observe(video);
    });
};
const setupPortfolioItemObserver = () => {
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.2 
    };

    const portfolioObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    }, observerOptions);

    portfolioItems.forEach(item => {
        portfolioObserver.observe(item);
    });
};

// --- Funções Auxiliares ---
const pauseAllVideos = () => {
  document.querySelectorAll('video').forEach(video => {
    if (!video.paused) {
      video.pause();
    }
  });
};

// --- Inicialização e Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  activateSobreMimDefault(); 
  activateNavLinkOnScroll();
  setupVideoObservers(); 
  setupPortfolioItemObserver(); 
});

window.addEventListener('scroll', () => {
  activateNavLinkOnScroll(); 
  animateTimelineItems(); 
 
});

window.addEventListener('resize', () => {
  activateNavLinkOnScroll();
  animateTimelineItems(); 
});


activateNavLinkOnScroll();


// ---------- INICIALIZAÇÃO DO EMAILJS ----------
// Substitua 'SEU_USER_ID' pelo seu User ID do EmailJS (Dashboard → Account → User ID)
emailjs.init('fRIExLcbJDAxBWMjw');

// ---------- SELEÇÃO DO FORMULÁRIO ----------
// Certifique-se que o id do seu <form> no HTML é "contato-form"
const form = document.getElementById('contato-form');

// ---------- EVENTO DE ENVIO ---------- 
form.addEventListener('submit', function(e) {
  e.preventDefault(); // Impede o envio padrão do formulário

  // ---------- ENVIO VIA EMAILJS ----------
  // Substitua 'SEU_SERVICE_ID' pelo ID do serviço que você criou no EmailJS
  // Substitua 'SEU_TEMPLATE_ID' pelo ID do template que você criou no EmailJS
  emailjs.sendForm('service_n6ec6yp', 'template_7dt5pwn', this)
    .then(function() {
      alert('Mensagem enviada com sucesso!');

      // ---------- REDIRECIONAMENTO PARA WHATSAPP ----------
      // Substitua 'SEU_NUMERO' pelo seu número de WhatsApp no formato internacional (ex: 5511999999999)
      // O texto após 'text=' é a mensagem que será pré-preenchida no WhatsApp
      window.open('https://w.app/ybidhi', '_blank');

      // ---------- LIMPAR FORMULÁRIO ----------
      form.reset();

    }, function(error) {
      // Exibe erro caso falhe o envio
      alert('Erro ao enviar a mensagem: ' + JSON.stringify(error));
    });
});

// ---------- MENU HAMBÚRGUER RESPONSIVO ----------
document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector('#menu-icon');
  const navbar = document.querySelector('nav');

  if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
      navbar.classList.toggle('active');
      menuIcon.classList.toggle('fa-xmark'); // alterna ícone (menu ↔ X)
    });
  }
});

// Quando clicar em Tecnologias
document.querySelector('.tecnologias-btn').addEventListener('click', function() {
    document.querySelector('.sobre-detalhe').classList.add('tecnologias-ativa');
});

// Quando clicar em Sobre Mim  
document.querySelector('.sobre-btn').addEventListener('click', function() {
    document.querySelector('.sobre-detalhe').classList.add('sobre-ativa');
});

// Quando clicar em Experiências
document.querySelector('.experiencias-btn').addEventListener('click', function() {
    document.querySelector('.sobre-detalhe').classList.add('experiencias-ativa');
});