// Script Simplificado e Funcional - Instituto UP
console.log('🚀 Script simplificado carregando...');

// Variáveis globais
let currentStep = 0;
const totalSteps = 7; // Atualizado para incluir resumo
let selectedPlan = '';

// CLIENT_ID único
const CLIENT_ID = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
const WEBHOOK_URL = 'https://up-n8n.welzbd.easypanel.host/webhook-test/a90b965c-7606-43eb-9d80-18e99bbd6718';

// Dados do questionário para resumo
let questionarioData = {
    modalidade: '',
    experiencia: '',
    objetivos: [],
    disponibilidade: '',
    investimento: '',
    urgencia: '',
    comprometimento: '',
    confianca: {}
};

console.log('🆔 CLIENT_ID gerado:', CLIENT_ID);
console.log('🔗 Webhook URL:', WEBHOOK_URL);

// Função de webhook simplificada
async function sendWebhook(step, data = {}) {
    try {
        const payload = {
            client_id: CLIENT_ID,
            timestamp: new Date().toISOString(),
            step_completed: step,
            ...data
        };
        
        console.log('📤 Enviando webhook:', payload);
        
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log('✅ Webhook enviado com sucesso!');
        } else {
            console.log('❌ Erro no webhook:', response.status);
        }
    } catch (error) {
        console.log('❌ Erro:', error.message);
    }
}

// Função de seleção de plano simplificada
function selectPlan(plan) {
    console.log('🎯 Plano selecionado:', plan);
    
    // Remove seleção anterior
    document.querySelectorAll('.plan-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Adiciona seleção
    const selectedOption = document.querySelector(`[data-plan="${plan}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        selectedPlan = plan;
        
        // Log detalhado da seleção para webhook
        console.log('🎯 CAPTURA DE MODALIDADE PARA WEBHOOK:');
        console.log('- Tipo selecionado:', plan);
        console.log('- Nome completo:', plan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual');
        console.log('- Timestamp:', new Date().toISOString());
        console.log('- Variable selectedPlan atualizada:', selectedPlan);
        
        // Habilita botão
        const btn = document.getElementById('planContinueBtn');
        if (btn) {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            btn.style.background = '#FF6B35';
            btn.innerHTML = 'Continuar <i class="fas fa-arrow-right"></i>';
            console.log('✅ Botão "Continuar" habilitado para modalidade:', plan);
        }
        
        // Envia webhook
        sendWebhook(0.5, {
            plan: plan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual',
            interaction: 'plan_selected'
        });
    }
}

// Funções de navegação simplificadas
function showStep(step) {
    console.log('📋 Mostrando step:', step);
    const steps = document.querySelectorAll('.form-step');
    
    steps.forEach((element, index) => {
        if (index === step) {
            element.style.display = 'block';
            setTimeout(() => element.classList.add('active'), 50);
        } else {
            element.classList.remove('active');
            setTimeout(() => element.style.display = 'none', 300);
        }
    });
    
    // Atualiza progresso
    const progressFill = document.getElementById('progressFill');
    const currentStepElement = document.getElementById('currentStep');
    
    if (progressFill && currentStepElement) {
        const progress = (step / totalSteps) * 100;
        progressFill.style.width = progress + '%';
        currentStepElement.textContent = step + 1;
    }
}

function nextStep() {
    console.log('⏭️ nextStep chamada! currentStep:', currentStep);
    
    // STEP 0 (Welcome) → STEP 1 (Plan Selection): Progressão livre
    if (currentStep === 0) {
        console.log('📋 STEP 0 → 1: Saindo do Welcome, indo para seleção de plano');
        currentStep++;
        showStep(currentStep);
        
        // Webhook para chegada na seleção de plano
        sendWebhook(1, {
            step_name: 'chegou_selecao_plano',
            conversion_step: 'step_1_plan_selection_reached',
            progress_percentage: (1 / totalSteps) * 100
        });
        return;
    }
    
    // STEP 1 (Plan Selection) → STEP 2: Verificar se plano foi selecionado
    if (currentStep === 1) {
        if (!selectedPlan) {
            alert('Por favor, escolha uma modalidade de mentoria antes de continuar.');
            return;
        }
        
        console.log('📋 STEP 1 → 2: Enviando modalidade selecionada:', selectedPlan);
        
        // Webhook específico do STEP 1 com modalidade selecionada
        const modalidadeCompleta = selectedPlan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual';
        
        sendWebhook(2, {
            step_name: 'modalidade_confirmada',
            modalidade_selecionada: selectedPlan,
            modalidade_nome_completo: modalidadeCompleta,
            conversion_step: 'step_2_plan_confirmed',
            plan_type: selectedPlan,
            plan_category: selectedPlan === 'grupo' ? 'group_mentoring' : 'individual_mentoring',
            progress_percentage: (2 / totalSteps) * 100,
            user_choice: {
                option: selectedPlan,
                display_name: modalidadeCompleta,
                timestamp: new Date().toISOString()
            }
        });
        
        console.log('✅ Webhook STEP 2 enviado com modalidade:', modalidadeCompleta);
    }
    
    // Progressão normal para outros steps
    if (currentStep < totalSteps - 1) {
        
        // Coletar dados antes de avançar para o resumo
        if (currentStep === totalSteps - 2) { // Penúltimo step → Resumo
            console.log('📋 Coletando dados para resumo...');
            coletarDadosQuestionario();
            generateSummary();
        }
        
        currentStep++;
        console.log('✅ Avançando para step:', currentStep);
        showStep(currentStep);
        
        // Webhook genérico para outros steps
        if (currentStep > 2) {
            sendWebhook(currentStep, {
                conversion_step: 'step_' + currentStep + '_reached',
                progress_percentage: (currentStep / totalSteps) * 100,
                current_plan: selectedPlan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual'
            });
        }
    } else {
        console.log('🏁 Questionário finalizado!');
        // Enviar dados finais
        sendWebhook(totalSteps, {
            conversion_step: 'questionnaire_completed',
            progress_percentage: 100,
            final_data: questionarioData,
            completion_time: new Date().toISOString()
        });
        alert('Questionário finalizado com sucesso!');
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM carregado!');
    
    if (document.querySelector('.typeform-section')) {
        console.log('✅ Seção encontrada, inicializando...');
        showStep(0);
        
        // Webhook inicial
        sendWebhook(0, {
            interaction: 'questionnaire_started',
            user_agent: navigator.userAgent,
            page_url: window.location.href
        });
        
        // Event listeners para planos
        const planOptions = document.querySelectorAll('.plan-option');
        console.log('🔍 Opções de plano encontradas:', planOptions.length);
        
        planOptions.forEach((option, index) => {
            console.log(`📝 Configurando plano ${index + 1}`);
            option.addEventListener('click', function() {
                const plan = this.getAttribute('data-plan');
                selectPlan(plan);
            });
        });
    }
});

// Função para coletar dados do questionário
function coletarDadosQuestionario() {
    console.log('📊 Coletando dados do questionário...');
    
    // Modalidade
    questionarioData.modalidade = selectedPlan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual';
    
    // Experiência
    const experiencia = document.querySelector('input[name="experiencia"]:checked');
    if (experiencia) {
        questionarioData.experiencia = experiencia.value;
    }
    
    // Objetivos
    const objetivos = document.querySelectorAll('input[name="objetivos"]:checked');
    questionarioData.objetivos = Array.from(objetivos).map(obj => obj.value);
    
    // Disponibilidade
    const disponibilidade = document.querySelector('input[name="disponibilidade"]:checked');
    if (disponibilidade) {
        questionarioData.disponibilidade = disponibilidade.value;
    }
    
    // Investimento
    const investimento = document.querySelector('input[name="investimento"]:checked');
    if (investimento) {
        questionarioData.investimento = investimento.value;
    }
    
    // Urgência
    const urgencia = document.querySelector('input[name="urgencia"]:checked');
    if (urgencia) {
        questionarioData.urgencia = urgencia.value;
    }
    
    // Comprometimento
    const comprometimento = document.querySelector('input[name="comprometimento"]:checked');
    if (comprometimento) {
        questionarioData.comprometimento = comprometimento.value;
    }
    
    // Confiança (múltiplas escalas)
    const confiancaFields = ['confianca_opiniao', 'confianca_feedback', 'confianca_lideranca', 'confianca_decisoes', 'confianca_networking'];
    confiancaFields.forEach(field => {
        const selected = document.querySelector(`input[name="${field}"]:checked`);
        if (selected) {
            questionarioData.confianca[field] = selected.value;
        }
    });
    
    console.log('✅ Dados coletados:', questionarioData);
}

// Função para gerar resumo personalizado
function generateSummary() {
    console.log('📋 Gerando resumo personalizado...');
    
    const summaryContainer = document.getElementById('summaryContent');
    if (!summaryContainer) {
        console.error('❌ Container de resumo não encontrado');
        return;
    }
    
    // Calcular pontuação de liderança
    const liderancaScore = calcularScoreLideranca();
    const recomendacao = gerarRecomendacao(liderancaScore);
    
    const summaryHTML = `
        <div class="summary-card">
            <div class="summary-section">
                <h4><i class="fas fa-user-check"></i> Modalidade Escolhida</h4>
                <p class="summary-value">${questionarioData.modalidade}</p>
            </div>
            
            <div class="summary-section">
                <h4><i class="fas fa-chart-line"></i> Nível de Experiência</h4>
                <p class="summary-value">${questionarioData.experiencia || 'Não informado'}</p>
            </div>
            
            <div class="summary-section">
                <h4><i class="fas fa-target"></i> Principais Objetivos</h4>
                <div class="summary-list">
                    ${questionarioData.objetivos.length > 0 ? 
                        questionarioData.objetivos.map(obj => `<span class="summary-tag">${obj}</span>`).join('') : 
                        '<span class="summary-tag">Não informado</span>'
                    }
                </div>
            </div>
            
            <div class="summary-section">
                <h4><i class="fas fa-clock"></i> Disponibilidade</h4>
                <p class="summary-value">${questionarioData.disponibilidade || 'Não informado'}</p>
            </div>
            
            <div class="summary-section">
                <h4><i class="fas fa-dollar-sign"></i> Investimento</h4>
                <p class="summary-value">${questionarioData.investimento || 'Não informado'}</p>
            </div>
            
            <div class="summary-section">
                <h4><i class="fas fa-fire"></i> Comprometimento</h4>
                <div class="commitment-meter">
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: ${(questionarioData.comprometimento || 0) * 10}%"></div>
                    </div>
                    <span class="meter-value">${questionarioData.comprometimento || 0}/10</span>
                </div>
            </div>
            
            <div class="summary-section">
                <h4><i class="fas fa-star"></i> Score de Liderança</h4>
                <div class="leadership-score">
                    <div class="score-circle">
                        <span class="score-number">${liderancaScore}</span>
                        <span class="score-total">/25</span>
                    </div>
                    <p class="score-description">${getScoreDescription(liderancaScore)}</p>
                </div>
            </div>
            
            <div class="recommendation-section">
                <h4><i class="fas fa-lightbulb"></i> Recomendação Personalizada</h4>
                <div class="recommendation-card">
                    <h5>${recomendacao.titulo}</h5>
                    <p>${recomendacao.descricao}</p>
                    <div class="recommendation-features">
                        ${recomendacao.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    summaryContainer.innerHTML = summaryHTML;
    console.log('✅ Resumo gerado com sucesso!');
}

// Calcular score de liderança baseado nas respostas de confiança
function calcularScoreLideranca() {
    let score = 0;
    const confiancaValues = Object.values(questionarioData.confianca);
    
    confiancaValues.forEach(value => {
        score += parseInt(value) || 0;
    });
    
    return score;
}

// Obter descrição do score
function getScoreDescription(score) {
    if (score >= 20) return "Excelente perfil de liderança";
    if (score >= 15) return "Bom potencial de liderança";
    if (score >= 10) return "Perfil em desenvolvimento";
    if (score >= 5) return "Oportunidades de crescimento";
    return "Grande potencial a ser desenvolvido";
}

// Gerar recomendação baseada no perfil
function gerarRecomendacao(liderancaScore) {
    const isGrupo = selectedPlan === 'grupo';
    const comprometimento = parseInt(questionarioData.comprometimento) || 0;
    
    if (isGrupo && liderancaScore >= 15 && comprometimento >= 8) {
        return {
            titulo: "🚀 Programa Intensivo de Liderança em Grupo",
            descricao: "Seu perfil indica alto potencial e comprometimento. Recomendamos o programa intensivo com foco em liderança transformacional.",
            features: ["Mentoria em grupo", "Sessions de 2h", "Networking premium", "Certificação avançada"]
        };
    } else if (!isGrupo && liderancaScore >= 12) {
        return {
            titulo: "👑 Mentoria Individual Executiva",
            descricao: "Seu perfil executivo merece atenção personalizada. Programa individual com foco em resultados específicos.",
            features: ["Mentoria 1:1", "Plano personalizado", "Suporte direto", "Resultados garantidos"]
        };
    } else if (isGrupo) {
        return {
            titulo: "🌱 Programa de Desenvolvimento em Grupo",
            descricao: "Perfeito para desenvolver suas habilidades em um ambiente colaborativo e de apoio mútuo.",
            features: ["Mentoria em grupo", "Aprendizado colaborativo", "Networking", "Crescimento gradual"]
        };
    } else {
        return {
            titulo: "🎯 Mentoria Individual Focada",
            descricao: "Desenvolvimento personalizado para acelerar seu crescimento pessoal e profissional.",
            features: ["Atenção individual", "Ritmo personalizado", "Foco específico", "Suporte contínuo"]
        };
    }
}

console.log('🎉 Script simplificado carregado com sucesso!');