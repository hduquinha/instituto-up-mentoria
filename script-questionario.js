// JavaScript para Questionário Completo - Instituto UP

// ===== TYPEFORM FUNCTIONALITY =====
let currentStep = 0;
const totalSteps = 6;
let selectedPlan = '';

// URL do webhook do n8n - SUBSTITUA PELA SUA URL REAL
const WEBHOOK_URL = 'https://up-n8n.welzbd.easypanel.host/webhook/a90b965c-7606-43eb-9d80-18e99bbd6718';

// Gerar ID único para o cliente/sessão
function generateClientId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `client_${timestamp}_${random}`;
}

// ID único para esta sessão
const CLIENT_ID = generateClientId();

// Dados cumulativos do questionário
let questionarioData = {
    client_id: CLIENT_ID,
    session_id: CLIENT_ID, // Mantém compatibilidade
    timestamp: new Date().toISOString(),
    step_completed: 0,
    plan: '',
    // Dados pessoais
    name: '',
    email: '',
    phone: '',
    city: '',
    age: '',
    profession: '',
    obstacles: '',
    // Diagnóstico
    main_objective: '',
    stress_situations: [],
    emotional_intelligence: '',
    // Futuro e comprometimento
    future_vision: '',
    commitment_level: '',
    confidence_scores: {
        expressing_opinions: '',
        difficult_conversations: '',
        public_speaking: '',
        assertiveness: ''
    },
    source: 'questionario_completo'
};

console.log('🆔 CLIENT_ID gerado:', CLIENT_ID);
console.log('📋 Questionário inicializado:', { currentStep, totalSteps, selectedPlan, clientId: CLIENT_ID });

// Função para enviar dados para o webhook
async function sendWebhook(stepCompleted, additionalData = {}) {
    try {
        // Atualizar dados cumulativos
        questionarioData.step_completed = stepCompleted;
        questionarioData.timestamp = new Date().toISOString();
        questionarioData.client_id = CLIENT_ID; // Garantir que sempre tenha o CLIENT_ID
        
        // Adicionar novos dados
        Object.assign(questionarioData, additionalData);
        
        console.log('📤 Enviando dados para webhook (CLIENT_ID:', CLIENT_ID, '):', questionarioData);
        console.log('🔗 URL do webhook:', WEBHOOK_URL);
        
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(questionarioData)
        });
        
        console.log('📡 Resposta do webhook:', response.status, response.statusText);
        
        if (response.ok) {
            const responseData = await response.text();
            console.log('✅ Webhook enviado com sucesso - Step:', stepCompleted);
            console.log('📥 Resposta do servidor:', responseData);
        } else {
            console.error('❌ Erro no webhook:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('❌ Detalhes do erro:', errorText);
        }
    } catch (error) {
        console.error('❌ Erro ao enviar webhook:', error);
        console.error('❌ Detalhes:', error.message);
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
    console.log('🚀 nextStep chamada, currentStep:', currentStep);
    console.log('📋 Estado atual:', {
        currentStep,
        selectedPlan,
        totalSteps,
        clientId: CLIENT_ID
    });
    
    // Step 0 → 1: Validação da escolha do plano
    if (currentStep === 0) {
        if (!selectedPlan) {
            alert('Por favor, escolha uma modalidade de mentoria.');
            return;
        }
        
        console.log('✅ Step 0→1: Plano confirmado, enviando webhook...');
        // Enviar webhook - Step 1 completado
        sendWebhook(1, {
            plan: selectedPlan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual',
            conversion_step: 'plan_confirmed',
            progress_percentage: (1/totalSteps) * 100
        });
    }
    
    // Step 1 → 2: Validação dos dados pessoais
    if (currentStep === 1) {
        if (!validateDadosPessoais()) return;
        
        console.log('✅ Step 1→2: Dados pessoais validados, enviando webhook...');
        const dadosPessoais = collectDadosPessoais();
        
        // Enviar webhook - Step 2 completado
        sendWebhook(2, {
            ...dadosPessoais,
            conversion_step: 'personal_data_completed',
            progress_percentage: (2/totalSteps) * 100
        });
    }
    
    // Step 2 → 3: Validação do diagnóstico
    if (currentStep === 2) {
        if (!validateDiagnostico()) return;
        
        console.log('✅ Step 2→3: Diagnóstico validado, enviando webhook...');
        const diagnosticoData = collectDiagnostico();
        
        // Enviar webhook - Step 3 completado
        sendWebhook(3, {
            ...diagnosticoData,
            conversion_step: 'diagnostic_completed',
            progress_percentage: (3/totalSteps) * 100
        });
    }
    
    // Step 3 → 4: Validação da visão de futuro
    if (currentStep === 3) {
        if (!validateFuturo()) return;
        
        console.log('✅ Step 3→4: Visão de futuro validada, enviando webhook...');
        const futuroData = collectFuturo();
        
        // Enviar webhook - Step 4 completado
        sendWebhook(4, {
            ...futuroData,
            conversion_step: 'future_vision_completed',
            progress_percentage: (4/totalSteps) * 100
        });
        
        // Atualizar resumo
        updateSummary();
    }
    
    // Step 4 → 5: Revisão do resumo
    if (currentStep === 4) {
        console.log('✅ Step 4→5: Resumo visualizado, enviando webhook...');
        // Enviar webhook - Step 5 completado
        sendWebhook(5, {
            conversion_step: 'summary_reviewed',
            progress_percentage: (5/totalSteps) * 100,
            ready_for_submission: true
        });
    }
    
    if (currentStep < totalSteps - 1) {
        currentStep++;
        console.log('⏭️ Avançando para step:', currentStep);
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
    console.log('🎯 selectPlan chamada com:', plan);
    const planOptions = document.querySelectorAll('.plan-option');
    console.log('📋 Total de opções encontradas:', planOptions.length);
    
    planOptions.forEach(option => option.classList.remove('selected'));
    
    const selectedOption = document.querySelector(`[data-plan="${plan}"]`);
    console.log('✅ Opção selecionada encontrada:', selectedOption);
    
    if (selectedOption) {
        selectedOption.classList.add('selected');
        selectedPlan = plan;
        console.log('🏆 Plano selecionado:', selectedPlan);
        
        // Habilitar botão continuar
        const continueBtn = document.getElementById('planContinueBtn');
        if (continueBtn) {
            continueBtn.style.opacity = '1';
            continueBtn.style.pointerEvents = 'auto';
            console.log('🔓 Botão continuar habilitado');
        }
        
        // Atualizar dados cumulativos
        questionarioData.plan = plan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual';
        
        // Atualizar campo hidden
        const selectedPlanInput = document.getElementById('selectedPlan');
        if (selectedPlanInput) {
            selectedPlanInput.value = questionarioData.plan;
        }
        
        // Enviar webhook imediatamente quando plano é selecionado
        sendWebhook(0.5, {
            plan: questionarioData.plan,
            plan_selection_time: new Date().toISOString(),
            interaction: 'plan_selected'
        });
    } else {
        console.error('❌ Elemento não encontrado para plano:', plan);
    }
}

// Funções de validação
function validateDadosPessoais() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cidade = document.getElementById('cidade').value;
    const idade = document.getElementById('idade').value;
    const profissao = document.getElementById('profissao').value;
    const obstaculos = document.getElementById('obstaculos').value;
    
    if (!nome || !email || !telefone || !cidade || !idade || !profissao || !obstaculos) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return false;
    }
    
    // Validação de idade
    if (idade < 18 || idade > 100) {
        alert('Por favor, insira uma idade válida entre 18 e 100 anos.');
        return false;
    }
    
    return true;
}

function validateDiagnostico() {
    const objetivoPrincipal = document.querySelector('input[name="objetivo_principal"]:checked');
    const situacoesEstresse = document.querySelectorAll('input[name="situacoes_estresse"]:checked');
    const inteligenciaEmocional = document.getElementById('inteligencia_emocional').value;
    
    if (!objetivoPrincipal) {
        alert('Por favor, selecione seu principal objetivo.');
        return false;
    }
    
    if (situacoesEstresse.length === 0) {
        alert('Por favor, selecione pelo menos uma situação onde o estresse afeta seu desempenho.');
        return false;
    }
    
    if (!inteligenciaEmocional) {
        alert('Por favor, descreva a habilidade de inteligência emocional que gostaria de desenvolver.');
        return false;
    }
    
    return true;
}

function validateFuturo() {
    const visaoFuturo = document.getElementById('visao_futuro').value;
    const comprometimento = document.querySelector('input[name="comprometimento"]:checked');
    const confiancaOpiniao = document.querySelector('input[name="confianca_opiniao"]:checked');
    const confiancaFeedback = document.querySelector('input[name="confianca_feedback"]:checked');
    const confiancaPublico = document.querySelector('input[name="confianca_publico"]:checked');
    const confiancaAssertividade = document.querySelector('input[name="confianca_assertividade"]:checked');
    
    if (!visaoFuturo) {
        alert('Por favor, descreva sua visão de futuro após a mentoria.');
        return false;
    }
    
    if (!comprometimento) {
        alert('Por favor, avalie seu nível de comprometimento.');
        return false;
    }
    
    if (!confiancaOpiniao || !confiancaFeedback || !confiancaPublico || !confiancaAssertividade) {
        alert('Por favor, avalie sua confiança em todas as áreas solicitadas.');
        return false;
    }
    
    return true;
}

// Funções de coleta de dados
function collectDadosPessoais() {
    return {
        name: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('telefone').value,
        city: document.getElementById('cidade').value,
        age: document.getElementById('idade').value,
        profession: document.getElementById('profissao').value,
        obstacles: document.getElementById('obstaculos').value
    };
}

function collectDiagnostico() {
    const situacoesEstresse = Array.from(document.querySelectorAll('input[name="situacoes_estresse"]:checked'))
        .map(input => input.value);
    
    const situacaoOutro = document.querySelector('input[name="situacoes_estresse_outro"]').value;
    if (situacaoOutro && situacoesEstresse.includes('outro')) {
        situacoesEstresse.push(`outro: ${situacaoOutro}`);
    }
    
    return {
        main_objective: document.querySelector('input[name="objetivo_principal"]:checked').value,
        stress_situations: situacoesEstresse,
        emotional_intelligence: document.getElementById('inteligencia_emocional').value
    };
}

function collectFuturo() {
    return {
        future_vision: document.getElementById('visao_futuro').value,
        commitment_level: document.querySelector('input[name="comprometimento"]:checked').value,
        confidence_scores: {
            expressing_opinions: document.querySelector('input[name="confianca_opiniao"]:checked').value,
            difficult_conversations: document.querySelector('input[name="confianca_feedback"]:checked').value,
            public_speaking: document.querySelector('input[name="confianca_publico"]:checked').value,
            assertiveness: document.querySelector('input[name="confianca_assertividade"]:checked').value
        }
    };
}

function updateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    if (!summaryContent) return;
    
    // Coletar todos os dados
    const allData = {
        ...questionarioData,
        ...collectDadosPessoais(),
        ...collectDiagnostico(),
        ...collectFuturo()
    };
    
    const objectives = {
        'gerenciar_ansiedade': 'Gerenciar ansiedade para decisões mais claras',
        'inteligencia_emocional': 'Desenvolver inteligência emocional para liderança',
        'foco_performance': 'Aumentar foco e performance, reduzir burnout',
        'comunicacao_influencia': 'Melhorar comunicação e influência',
        'equilibrio_vida': 'Equilibrar demandas profissionais e pessoais'
    };
    
    summaryContent.innerHTML = `
        <div class="summary-item"><strong>Modalidade:</strong> <span>${allData.plan}</span></div>
        <div class="summary-item"><strong>Nome:</strong> <span>${allData.name}</span></div>
        <div class="summary-item"><strong>E-mail:</strong> <span>${allData.email}</span></div>
        <div class="summary-item"><strong>Telefone:</strong> <span>${allData.phone}</span></div>
        <div class="summary-item"><strong>Cidade:</strong> <span>${allData.city}</span></div>
        <div class="summary-item"><strong>Idade:</strong> <span>${allData.age} anos</span></div>
        <div class="summary-item"><strong>Profissão:</strong> <span>${allData.profession}</span></div>
        <div class="summary-item"><strong>Principal Objetivo:</strong> <span>${objectives[allData.main_objective] || allData.main_objective}</span></div>
        <div class="summary-item"><strong>Nível de Comprometimento:</strong> <span>${allData.commitment_level}/10</span></div>
    `;
}

function submitForm() {
    console.log('🏁 submitForm chamada - Finalizando questionário...');
    
    // Coletar TODOS os dados finais de uma vez
    const dadosPessoais = collectDadosPessoais();
    const diagnosticoData = collectDiagnostico();
    const futuroData = collectFuturo();
    
    // Compilar dados completos
    const finalData = {
        // Dados base sempre presentes
        client_id: CLIENT_ID,
        session_id: CLIENT_ID,
        timestamp: new Date().toISOString(),
        step_completed: 6,
        
        // Dados coletados
        ...dadosPessoais,
        ...diagnosticoData,
        ...futuroData,
        
        // Metadados de finalização
        status: 'completed',
        conversion_step: 'questionnaire_submitted',
        completion_time: new Date().toISOString(),
        progress_percentage: 100,
        
        // Dados de sessão
        total_time_spent: Date.now() - new Date(questionarioData.timestamp).getTime(),
        source: 'questionario_completo'
    };
    
    console.log('📊 Dados finais compilados:', finalData);
    
    // Enviar webhook final com TODOS os dados
    sendWebhook(6, finalData);
    
    // Montar mensagem WhatsApp
    let mensagem = `🎯 *QUESTIONÁRIO MENTORIA AUTODOMÍNIO COMPLETO*\n\n`;
    mensagem += `👤 *Nome:* ${finalData.name}\n`;
    mensagem += `📧 *Email:* ${finalData.email}\n`;
    mensagem += `📱 *WhatsApp:* ${finalData.phone}\n`;
    mensagem += `🏙️ *Cidade:* ${finalData.city}\n`;
    mensagem += `🎂 *Idade:* ${finalData.age} anos\n`;
    mensagem += `💼 *Profissão:* ${finalData.profession}\n`;
    mensagem += `🎓 *Modalidade:* ${finalData.plan}\n`;
    mensagem += `💪 *Comprometimento:* ${finalData.commitment_level}/10\n`;
    mensagem += `\n✨ Questionário completo preenchido - Interessado na mentoria de autodomínio!`;
    
    // Número do WhatsApp (substitua pelo número real)
    const whatsappNumber = '5511999999999';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
    
    console.log('📱 Redirecionando para WhatsApp em 3 segundos...');
    
    // Simular processamento e redirecionar
    setTimeout(() => {
        currentStep++;
        showStep(currentStep);
        
        // Redirecionar para WhatsApp após mostrar tela de sucesso
        setTimeout(() => {
            console.log('🚀 Abrindo WhatsApp...');
            window.open(whatsappUrl, '_blank');
        }, 3000);
    }, 1000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOMContentLoaded disparado!');
    
    const typeformSection = document.querySelector('.typeform-section');
    console.log('🔍 Seção typeform encontrada:', !!typeformSection);
    
    if (typeformSection) {
        console.log('✅ Inicializando questionário...');
        showStep(0);
        
        // Webhook de inicialização
        console.log('🚀 Iniciando questionário para CLIENT_ID:', CLIENT_ID);
        sendWebhook(0, {
            interaction: 'questionnaire_started',
            user_agent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            page_url: window.location.href,
            client_id: CLIENT_ID
        });
        
        // Event listeners para seleção de planos
        const planOptions = document.querySelectorAll('.plan-option');
        console.log('🔍 Elementos .plan-option encontrados:', planOptions.length);
        
        planOptions.forEach((option, index) => {
            console.log(`📝 Adicionando listener ao plano ${index + 1}:`, option.getAttribute('data-plan'));
            option.addEventListener('click', function() {
                const plan = this.getAttribute('data-plan');
                console.log('🖱️ Clique detectado no plano:', plan);
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
            if (e.key === 'Enter' && currentStep < 5) {
                e.preventDefault();
                nextStep();
            }
            if (e.key === 'Escape' && currentStep > 0) {
                prevStep();
            }
        });
        
        // Webhook de abandono
        window.addEventListener('beforeunload', function() {
            if (currentStep < totalSteps) {
                sendWebhook(currentStep + 0.1, {
                    interaction: 'questionnaire_abandoned',
                    last_step: currentStep,
                    time_spent: Date.now() - new Date(questionarioData.timestamp).getTime(),
                    client_id: CLIENT_ID
                });
            }
        });
    }
});