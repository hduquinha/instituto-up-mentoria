// JavaScript para Landing Page de Captura - Modelo VDV

document.addEventListener('DOMContentLoaded', function() {
    
    // Video functionality
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const iframe = document.querySelector('.video-container iframe');
    
    if (videoPlaceholder && iframe) {
        videoPlaceholder.addEventListener('click', function() {
            // Substitua 'VIDEO_ID' pelo ID real do vídeo do YouTube
            // Para YouTube: https://www.youtube.com/embed/VIDEO_ID
            // Para Vimeo: https://player.vimeo.com/video/VIDEO_ID
            const videoUrl = 'https://www.youtube.com/embed/VIDEO_ID?autoplay=1';
            
            iframe.src = videoUrl;
            iframe.style.display = 'block';
            videoPlaceholder.style.display = 'none';
        });
    }
    
    // Questionário form
    const questionarioForm = document.getElementById('questionarioForm');
    if (questionarioForm) {
        questionarioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const nome = formData.get('nome');
            const telefone = formData.get('telefone');
            const email = formData.get('email');
            const profissao = formData.get('profissao');
            const objetivo = formData.get('objetivo');
            const disponibilidade = formData.get('disponibilidade');
            const experiencia = formData.get('experiencia');
            const observacoes = formData.get('observacoes');
            
            // Montar mensagem WhatsApp
            let mensagem = `🎯 *QUESTIONÁRIO - MENTORIA AUTODOMÍNIO*\n\n`;
            mensagem += `👤 *Nome:* ${nome}\n`;
            mensagem += `📧 *Email:* ${email}\n`;
            mensagem += `💼 *Profissão:* ${profissao}\n`;
            mensagem += `🎯 *Objetivo:* ${objetivo}\n`;
            mensagem += `⏰ *Disponibilidade:* ${disponibilidade}\n`;
            if (experiencia) {
                mensagem += `📚 *Experiência anterior:* ${experiencia}\n`;
            }
            if (observacoes) {
                mensagem += `📝 *Observações:* ${observacoes}\n`;
            }
            mensagem += `\n✅ Aguardo contato do time para conhecer a melhor opção de mentoria para meu perfil!`;
            
            const whatsappURL = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
            
            // Mostrar mensagem de sucesso
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check me-2"></i>QUESTIONÁRIO ENVIADO!';
            button.disabled = true;
            button.classList.remove('btn-primary');
            button.classList.add('btn-success');
            
            // Abrir WhatsApp
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
            }, 1000);
            
            // Reset após 3 segundos
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
                this.reset();
            }, 3000);
        });
    }

    // Smooth scrolling para questionário
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Formulários de Mentoria
    const grupoForm = document.getElementById('grupoForm');
    const individualForm = document.getElementById('individualForm');
    
    // Mostrar formulários baseado no plano escolhido
    const grupoButtons = document.querySelectorAll('a[href="#contato-grupo"]');
    const individualButtons = document.querySelectorAll('a[href="#contato-individual"]');
    
    grupoButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('contato-grupo').style.display = 'block';
            document.getElementById('contato-individual').style.display = 'none';
            document.getElementById('contato-grupo').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    individualButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('contato-individual').style.display = 'block';
            document.getElementById('contato-grupo').style.display = 'none';
            document.getElementById('contato-individual').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Função para processar formulários
    function processForm(form, planoTipo) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const dados = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                telefone: formData.get('telefone'),
                cargo: formData.get('cargo') || '',
                plano: formData.get('plano')
            };
            
            // Validação básica
            if (!dados.nome || !dados.email || !dados.telefone) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(dados.email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>PROCESSANDO...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                let mensagem = '';
                
                if (planoTipo === 'grupo') {
                    mensagem = `Olá! Tenho interesse na *Mentoria em Grupo*.

*Meus dados:*
Nome: ${dados.nome}
E-mail: ${dados.email}
WhatsApp: ${dados.telefone}

Gostaria de saber mais sobre:
- Próxima turma (Janeiro 2025)
- Formas de pagamento
- Cronograma das aulas

Aguardo retorno!`;
                } else {
                    mensagem = `Olá! Tenho interesse na *Mentoria Individual*.

*Meus dados:*
Nome: ${dados.nome}
E-mail: ${dados.email}
WhatsApp: ${dados.telefone}
Cargo: ${dados.cargo}

Gostaria de agendar uma conversa para:
- Conhecer melhor a mentoria individual
- Entender se é adequada para meu perfil
- Verificar disponibilidade

Aguardo retorno!`;
                }
                
                const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
                
                submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>REDIRECIONANDO...';
                submitBtn.classList.add('btn-success');
                
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                    
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-success');
                    
                    alert(`Interesse registrado! Você será redirecionado para o WhatsApp para falar sobre a ${dados.plano}.`);
                }, 2000);
                
            }, 1500);
        });
    }
    
    // Aplicar processamento aos formulários
    if (grupoForm) {
        processForm(grupoForm, 'grupo');
    }
    
    if (individualForm) {
        processForm(individualForm, 'individual');
    }

    // Animação de entrada para elementos quando entram na viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.testimonial-card, .process-step, .mentorship-step, .mentor-card, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Contador animado para números
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (element.textContent.includes('+')) {
                element.textContent = Math.floor(start) + '+';
            } else {
                element.textContent = Math.floor(start);
            }
            
            if (start >= target) {
                if (element.textContent.includes('+')) {
                    element.textContent = target + '+';
                } else {
                    element.textContent = target;
                }
                clearInterval(timer);
            }
        }, 16);
    }

    // Aplicar contador aos números grandes
    const bigNumbers = document.querySelectorAll('.big-number');
    bigNumbers.forEach(number => {
        const target = parseInt(number.textContent.replace('+', ''));
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(number, target);
                    counterObserver.unobserve(number);
                }
            });
        });
        counterObserver.observe(number);
    });

    // WhatsApp Button interaction
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton) {
        // Mostrar/esconder baseado no scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                whatsappButton.style.opacity = '1';
                whatsappButton.style.visibility = 'visible';
            } else {
                whatsappButton.style.opacity = '0.8';
                whatsappButton.style.visibility = 'visible';
            }
        });

        // Efeito de clique
        whatsappButton.addEventListener('click', function() {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Efeitos hover melhorados para cards
    const cards = document.querySelectorAll('.testimonial-card, .process-step, .mentorship-step');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Tracking de eventos (para Analytics)
    function trackEvent(eventName, elementInfo) {
        // Aqui você pode integrar com Google Analytics ou outras ferramentas
        console.log(`Evento: ${eventName}`, elementInfo);
        
        // Exemplo para Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Landing Page',
                event_label: elementInfo
            });
        }
    }

    // Rastrear cliques nos CTAs
    const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary, .btn-light');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('cta_click', this.textContent.trim());
        });
    });

    // Rastrear chegada nas seções importantes
    const importantSections = document.querySelectorAll('#formulario, .stats-section, .final-cta-section');
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.id || entry.target.className.split(' ')[0];
                trackEvent('section_view', sectionName);
            }
        });
    }, { threshold: 0.5 });

    importantSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Máscara para telefone brasileiro
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    telefoneInputs.forEach(telefoneInput => {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 7) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    });

    // Performance: Debounce para eventos de scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Aplicar debounce ao scroll
    const debouncedScroll = debounce(() => {
        // Qualquer lógica de scroll que seja necessária
    }, 10);

    window.addEventListener('scroll', debouncedScroll);

    // Easter egg: Confetti para formulário enviado
    function createConfetti() {
        const colors = ['#00A99D', '#FF6B35', '#FFD700', '#28a745'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * window.innerWidth}px;
                    top: -10px;
                    z-index: 10000;
                    pointer-events: none;
                    border-radius: 50%;
                `;
                
                document.body.appendChild(confetti);
                
                const animation = confetti.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { 
                        transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, 
                        opacity: 0 
                    }
                ], {
                    duration: 3000 + Math.random() * 2000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
                
                animation.onfinish = () => confetti.remove();
            }, i * 30);
        }
    }

    console.log('🚀 Landing Page de Captura carregada com sucesso!');
    console.log('📊 Tracking de eventos ativado');
    console.log('📱 Formulário integrado com WhatsApp');
});

// ===== TYPEFORM FUNCTIONALITY =====
let currentStep = 0;
const totalSteps = 4;
let selectedPlan = '';

// URL do webhook do n8n - SUBSTITUA PELA SUA URL REAL
const WEBHOOK_URL = 'https://up-n8n.welzbd.easypanel.host/webhook-test/a90b965c-7606-43eb-9d80-18e99bbd6718';

// Dados cumulativos do formulário
let formData = {
    timestamp: new Date().toISOString(),
    step_completed: 0,
    plan: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    source: 'formulario_typeform'
};

console.log('Typeform variables initialized:', { currentStep, totalSteps, selectedPlan });

// Função para enviar dados para o webhook
async function sendWebhook(stepCompleted, additionalData = {}) {
    try {
        // Atualizar dados cumulativos
        formData.step_completed = stepCompleted;
        formData.timestamp = new Date().toISOString();
        
        // Adicionar novos dados
        Object.assign(formData, additionalData);
        
        console.log('Enviando dados para webhook:', formData);
        
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            console.log('✅ Webhook enviado com sucesso - Step:', stepCompleted);
        } else {
            console.error('❌ Erro no webhook:', response.status);
        }
    } catch (error) {
        console.error('❌ Erro ao enviar webhook:', error);
        // Não bloquear o fluxo se o webhook falhar
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepElement = document.getElementById('currentStep');
    
    if (progressFill && currentStepElement) {
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = progress + '%';
        currentStepElement.textContent = currentStep + 1;
    }
}

function showStep(stepIndex) {
    const steps = document.querySelectorAll('.form-step');
    
    steps.forEach((step, index) => {
        if (index === stepIndex) {
            step.style.display = 'block';
            setTimeout(() => {
                step.classList.add('active');
            }, 50);
        } else {
            step.classList.remove('active');
            setTimeout(() => {
                step.style.display = 'none';
            }, 300);
        }
    });
    
    updateProgress();
}

function nextStep() {
    console.log('nextStep chamada, currentStep:', currentStep);
    console.log('selectedPlan:', selectedPlan);
    
    const steps = document.querySelectorAll('.form-step');
    
    // Validação específica por step
    if (currentStep === 1) { // Step de escolha do plano
        if (!selectedPlan) {
            alert('Por favor, escolha uma modalidade de mentoria.');
            return;
        }
        
        // Enviar webhook - Step 1 completado (escolha do plano)
        sendWebhook(1, {
            plan: selectedPlan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual'
        });
    }
    
    if (currentStep === 2) { // Step de dados pessoais
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const cargo = document.getElementById('cargo').value;
        const cargoField = document.getElementById('cargoField');
        
        console.log('Dados do formulário:', { nome, email, telefone, cargo });
        
        if (!nome || !email || !telefone) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Validação do campo cargo para mentoria individual
        if (selectedPlan === 'individual' && !cargo) {
            alert('Por favor, preencha o campo cargo para a mentoria individual.');
            return;
        }
        
        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }
        
        // Enviar webhook - Step 2 completado (dados pessoais)
        sendWebhook(2, {
            name: nome,
            email: email,
            phone: telefone,
            position: cargo
        });
        
        // Atualizar resumo
        updateSummary();
    }
    
    if (currentStep === 3) { // Step de confirmação
        // Enviar webhook - Step 3 completado (confirmação)
        sendWebhook(3, {
            status: 'confirmed',
            conversion_step: 'confirmation_viewed'
        });
    }
    
    if (currentStep < totalSteps) {
        currentStep++;
        console.log('Avançando para step:', currentStep);
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

function selectPlan(plan) {
    console.log('selectPlan chamada com:', plan);
    const planOptions = document.querySelectorAll('.plan-option');
    planOptions.forEach(option => option.classList.remove('selected'));
    
    const selectedOption = document.querySelector(`[data-plan="${plan}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        selectedPlan = plan;
        console.log('Plano selecionado:', selectedPlan);
        
        // Habilitar botão continuar
        const continueBtn = document.getElementById('planContinueBtn');
        if (continueBtn) {
            continueBtn.style.opacity = '1';
            continueBtn.style.pointerEvents = 'auto';
        }
        
        // Atualizar dados cumulativos
        formData.plan = plan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual';
        
        // Atualizar campo hidden
        const selectedPlanInput = document.getElementById('selectedPlan');
        if (selectedPlanInput) {
            selectedPlanInput.value = plan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual';
        }
        
        // Mostrar/esconder campo cargo para mentoria individual
        const cargoField = document.getElementById('cargoField');
        if (cargoField) {
            if (plan === 'individual') {
                cargoField.style.display = 'block';
                const cargoInput = document.getElementById('cargo');
                if (cargoInput) cargoInput.required = true;
            } else {
                cargoField.style.display = 'none';
                const cargoInput = document.getElementById('cargo');
                if (cargoInput) cargoInput.required = false;
            }
        }
        
        // Enviar webhook imediatamente quando plano é selecionado
        sendWebhook(0.5, {
            plan: formData.plan,
            plan_selection_time: new Date().toISOString(),
            interaction: 'plan_selected'
        });
    } else {
        console.error('Elemento não encontrado para plano:', plan);
    }
}

function updateSummary() {
    const planSummary = document.getElementById('planSummary');
    const nameSummary = document.getElementById('nameSummary');
    const emailSummary = document.getElementById('emailSummary');
    const phoneSummary = document.getElementById('phoneSummary');
    
    if (planSummary) planSummary.textContent = selectedPlan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual';
    if (nameSummary) nameSummary.textContent = document.getElementById('nome').value;
    if (emailSummary) emailSummary.textContent = document.getElementById('email').value;
    if (phoneSummary) phoneSummary.textContent = document.getElementById('telefone').value;
}

function submitForm() {
    const formDataFromForm = new FormData(document.getElementById('mainForm'));
    
    // Coletar dados finais
    const nome = formDataFromForm.get('nome');
    const email = formDataFromForm.get('email');
    const telefone = formDataFromForm.get('telefone');
    const plano = formDataFromForm.get('plano');
    const cargo = formDataFromForm.get('cargo') || '';
    
    // Enviar webhook final - Formulário completado
    sendWebhook(4, {
        name: nome,
        email: email,
        phone: telefone,
        position: cargo,
        status: 'completed',
        conversion_step: 'form_submitted',
        completion_time: new Date().toISOString()
    });
    
    // Montar mensagem WhatsApp
    let mensagem = `🎯 *INSCRIÇÃO MENTORIA AUTODOMÍNIO*\n\n`;
    mensagem += `👤 *Nome:* ${nome}\n`;
    mensagem += `📧 *Email:* ${email}\n`;
    mensagem += `📱 *WhatsApp:* ${telefone}\n`;
    mensagem += `🎓 *Modalidade:* ${plano}\n`;
    if (cargo) {
        mensagem += `💼 *Cargo:* ${cargo}\n`;
    }
    mensagem += `\n✨ Tenho interesse na mentoria de autodomínio!`;
    
    // Enviar para WhatsApp (substitua pelo número real)
    const whatsappNumber = '5511999999999';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
    
    // Simular envio de dados
    setTimeout(() => {
        currentStep++;
        showStep(currentStep);
        
        // Opcional: redirecionar para WhatsApp após alguns segundos
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 3000);
    }, 1000);
}

// Event Listeners para o formulário Typeform
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar formulário
    if (document.querySelector('.typeform-section')) {
        showStep(0);
        
        // Webhook de inicialização - Usuário acessou o formulário
        sendWebhook(0, {
            interaction: 'form_started',
            user_agent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            page_url: window.location.href
        });
        
        // Event listeners para seleção de planos
        const planOptions = document.querySelectorAll('.plan-option');
        planOptions.forEach(option => {
            option.addEventListener('click', function() {
                const plan = this.getAttribute('data-plan');
                selectPlan(plan);
            });
        });
        
        // Máscara para telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            });
        }
        
        // Navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && currentStep < 2) {
                nextStep();
            }
            if (e.key === 'Escape' && currentStep > 0) {
                prevStep();
            }
        });
        
        // Webhook de abandono quando usuário sai da página
        window.addEventListener('beforeunload', function() {
            sendWebhook(currentStep + 0.1, {
                interaction: 'form_abandoned',
                last_step: currentStep,
                time_spent: Date.now() - formData.timestamp
            });
        });
    }
});