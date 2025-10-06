// Script Simplificado e Funcional - Instituto UP
console.log('🚀 Script simplificado carregando...');

// Variáveis globais
let currentStep = 0;
const totalSteps = 8; // Atualizado: Welcome + 6 steps + Resumo + Sucesso
let selectedPlan = '';

// CLIENT_ID único
const CLIENT_ID = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
const WEBHOOK_URL = 'https://up-n8n.welzbd.easypanel.host/webhook/a90b965c-7606-43eb-9d80-18e99bbd6718';

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

// Função para coletar dados atuais do formulário em tempo real
function coletarDadosAtuais() {
    const dados = {
        modalidade: selectedPlan,
        modalidade_completa: selectedPlan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual',
        experiencia: null,
        objetivos: [],
        disponibilidade: null,
        investimento: null,
        urgencia: null,
        comprometimento: null,
        confianca: {},
        dados_pessoais: {},
        visao_futuro: null,
        obstaculos: null,
        objetivo_principal: null,
        ansiedade_situacoes: [],
        habilidade_inteligencia_emocional: null
    };
    
    // Experiência
    const experiencia = document.querySelector('input[name="experiencia"]:checked');
    if (experiencia) dados.experiencia = experiencia.value;
    
    // Objetivos
    const objetivos = document.querySelectorAll('input[name="objetivos"]:checked');
    dados.objetivos = Array.from(objetivos).map(obj => obj.value);
    
    // Disponibilidade
    const disponibilidade = document.querySelector('input[name="disponibilidade"]:checked');
    if (disponibilidade) dados.disponibilidade = disponibilidade.value;
    
    // Investimento
    const investimento = document.querySelector('input[name="investimento"]:checked');
    if (investimento) dados.investimento = investimento.value;
    
    // Urgência
    const urgencia = document.querySelector('input[name="urgencia"]:checked');
    if (urgencia) dados.urgencia = urgencia.value;
    
    // Comprometimento
    const comprometimento = document.querySelector('input[name="comprometimento"]:checked');
    if (comprometimento) dados.comprometimento = comprometimento.value;
    
    // Visão de futuro
    const visaoFuturo = document.getElementById('visao_futuro');
    if (visaoFuturo) dados.visao_futuro = visaoFuturo.value;
    
    // Dados pessoais
    const nome = document.getElementById('nome');
    const instagram = document.getElementById('instagram');
    const telefone = document.getElementById('telefone');
    const cidade = document.getElementById('cidade');
    const idade = document.getElementById('idade');
    const empresa = document.getElementById('empresa');
    const profissao = document.getElementById('profissao');
    
    if (nome) dados.dados_pessoais.nome = nome.value;
    if (instagram) dados.dados_pessoais.instagram = instagram.value;
    if (telefone) dados.dados_pessoais.telefone = telefone.value;
    if (cidade) dados.dados_pessoais.cidade = cidade.value;
    if (idade) dados.dados_pessoais.idade = idade.value;
    if (empresa) dados.dados_pessoais.empresa = empresa.value;
    if (profissao) dados.dados_pessoais.profissao = profissao.value;
    
    // Obstáculos
    const obstaculos = document.getElementById('obstaculos');
    if (obstaculos) dados.obstaculos = obstaculos.value;
    
    // Objetivo principal
    const objetivoPrincipal = document.querySelector('input[name="objetivo_principal"]:checked');
    if (objetivoPrincipal) dados.objetivo_principal = objetivoPrincipal.value;
    
    // Situações de ansiedade/estresse
    const ansiedadeSituacoes = document.querySelectorAll('input[name="ansiedade_situacoes"]:checked');
    dados.ansiedade_situacoes = Array.from(ansiedadeSituacoes).map(sit => sit.value);
    
    // Habilidade de Inteligência Emocional
    const habilidadeIE = document.querySelector('input[name="habilidade_ie"]:checked');
    if (habilidadeIE) dados.habilidade_inteligencia_emocional = habilidadeIE.value;
    
    // Confiança (múltiplas escalas)
    const confiancaFields = ['confianca_opiniao', 'confianca_feedback', 'confianca_lideranca', 'confianca_decisoes', 'confianca_networking'];
    confiancaFields.forEach(field => {
        const selected = document.querySelector(`input[name="${field}"]:checked`);
        if (selected) dados.confianca[field] = selected.value;
    });
    
    return dados;
}

// Função de webhook simplificada
async function sendWebhook(step, data = {}) {
    try {
        // Coletar dados atualizados do formulário a cada envio
        const dadosAtuais = coletarDadosAtuais();
        
        const payload = {
            client_id: CLIENT_ID,
            timestamp: new Date().toISOString(),
            step_completed: step,
            session_data: dadosAtuais, // Todos os dados coletados até agora
            current_step_data: data,   // Dados específicos do step atual
            progress_percentage: (step / 7) * 100,
            ...data
        };
        
        console.log('📤 Enviando webhook com dados acumulados:', payload);
        
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
        // Não incluir o step final de sucesso no cálculo da progress bar
        const progressSteps = Math.min(step, 7); // Máximo 7 para não incluir step de sucesso
        const progress = (progressSteps / 7) * 100;
        progressFill.style.width = progress + '%';
        currentStepElement.textContent = Math.min(step + 1, 7); // Mostrar no máximo 7
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
            action: 'started_plan_selection'
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
        
        sendWebhook(2, {
            step_name: 'modalidade_confirmada',
            conversion_step: 'step_2_plan_confirmed',
            action: 'plan_confirmed',
            plan_details: {
                tipo: selectedPlan,
                nome_completo: selectedPlan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual',
                categoria: selectedPlan === 'grupo' ? 'group_mentoring' : 'individual_mentoring'
            }
        });
        
        console.log('✅ Webhook STEP 2 enviado com modalidade:', selectedPlan);
    }
    
    // STEP 2 → STEP 3: Dados pessoais coletados
    if (currentStep === 2) {
        sendWebhook(3, {
            step_name: 'dados_pessoais_coletados',
            conversion_step: 'step_3_personal_data',
            action: 'personal_data_completed'
        });
    }
    
    // STEP 3 → STEP 4: Diagnóstico/experiência coletada
    if (currentStep === 3) {
        sendWebhook(4, {
            step_name: 'diagnostico_experiencia',
            conversion_step: 'step_4_experience_assessment',
            action: 'experience_data_completed'
        });
    }
    
    // STEP 4 → STEP 5: Visão de futuro e comprometimento
    if (currentStep === 4) {
        sendWebhook(5, {
            step_name: 'visao_futuro_comprometimento',
            conversion_step: 'step_5_future_vision',
            action: 'future_vision_completed'
        });
    }
    
    // STEP 5 → STEP 6: Dados finais coletados
    if (currentStep === 5) {
        sendWebhook(6, {
            step_name: 'dados_finais_coletados',
            conversion_step: 'step_6_final_data',
            action: 'final_assessment_completed'
        });
    }
    
    // Progressão normal para outros steps
    if (currentStep < totalSteps - 1) {
        
        // Coletar dados antes de avançar para o resumo (step 6 → step 7)
        if (currentStep === 6) { // Step 6 → Step 7 (Resumo)
            console.log('📋 Coletando dados para resumo...');
            coletarDadosQuestionario();
            
            // Enviar webhook com dados completos para o resumo
            sendWebhook(7, {
                step_name: 'resumo_gerado',
                conversion_step: 'step_7_summary_generated',
                action: 'summary_displayed'
            });
            
            // Aguardar um pouco antes de gerar o resumo
            setTimeout(() => {
                console.log('🎨 Gerando resumo visual...');
                generateSummary();
            }, 500);
        }
        
        currentStep++;
        console.log('✅ Avançando para step:', currentStep);
        showStep(currentStep);
        
    } else {
        console.log('🏁 Questionário finalizado!');
        // Enviar dados finais completos
        sendWebhook(8, {
            step_name: 'questionario_finalizado',
            conversion_step: 'questionnaire_completed',
            action: 'questionnaire_completed',
            completion_time: new Date().toISOString(),
            total_steps_completed: currentStep + 1
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
    console.log('✅ Modalidade:', questionarioData.modalidade);
    
    // Experiência
    const experiencia = document.querySelector('input[name="experiencia"]:checked');
    if (experiencia) {
        questionarioData.experiencia = experiencia.value;
        console.log('✅ Experiência:', questionarioData.experiencia);
    } else {
        console.log('⚠️ Experiência não encontrada');
    }
    
    // Objetivos
    const objetivos = document.querySelectorAll('input[name="objetivos"]:checked');
    questionarioData.objetivos = Array.from(objetivos).map(obj => obj.value);
    console.log('✅ Objetivos encontrados:', questionarioData.objetivos.length);
    
    // Disponibilidade
    const disponibilidade = document.querySelector('input[name="disponibilidade"]:checked');
    if (disponibilidade) {
        questionarioData.disponibilidade = disponibilidade.value;
        console.log('✅ Disponibilidade:', questionarioData.disponibilidade);
    } else {
        console.log('⚠️ Disponibilidade não encontrada');
    }
    
    // Investimento
    const investimento = document.querySelector('input[name="investimento"]:checked');
    if (investimento) {
        questionarioData.investimento = investimento.value;
        console.log('✅ Investimento:', questionarioData.investimento);
    } else {
        console.log('⚠️ Investimento não encontrado');
    }
    
    // Urgência
    const urgencia = document.querySelector('input[name="urgencia"]:checked');
    if (urgencia) {
        questionarioData.urgencia = urgencia.value;
        console.log('✅ Urgência:', questionarioData.urgencia);
    } else {
        console.log('⚠️ Urgência não encontrada');
    }
    
    // Comprometimento
    const comprometimento = document.querySelector('input[name="comprometimento"]:checked');
    if (comprometimento) {
        questionarioData.comprometimento = comprometimento.value;
        console.log('✅ Comprometimento:', questionarioData.comprometimento);
    } else {
        console.log('⚠️ Comprometimento não encontrado');
    }
    
    // Confiança (múltiplas escalas)
    const confiancaFields = ['confianca_opiniao', 'confianca_feedback', 'confianca_lideranca', 'confianca_decisoes', 'confianca_networking'];
    confiancaFields.forEach(field => {
        const selected = document.querySelector(`input[name="${field}"]:checked`);
        if (selected) {
            questionarioData.confianca[field] = selected.value;
            console.log(`✅ ${field}:`, selected.value);
        } else {
            console.log(`⚠️ ${field} não encontrado`);
        }
    });
    
    console.log('📋 Dados coletados completos:', questionarioData);
}

// Função para gerar resumo personalizado
function generateSummary() {
    console.log('📋 Gerando resumo personalizado...');
    
    const summaryContainer = document.getElementById('summaryContent');
    if (!summaryContainer) {
        console.error('❌ Container de resumo não encontrado');
        console.log('🔍 Tentando encontrar container alternativo...');
        
        // Tentar encontrar por classe
        const altContainer = document.querySelector('.summary-content');
        if (!altContainer) {
            console.error('❌ Nenhum container de resumo encontrado');
            return;
        } else {
            console.log('✅ Container alternativo encontrado');
        }
    }
    
    const container = summaryContainer || document.querySelector('.summary-content');
    
    // Calcular pontuação de liderança
    const liderancaScore = calcularScoreLideranca();
    const recomendacao = gerarRecomendacao(liderancaScore);
    
    console.log('📊 Score de liderança calculado:', liderancaScore);
    console.log('💡 Recomendação gerada:', recomendacao.titulo);
    
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
    
    container.innerHTML = summaryHTML;
    console.log('✅ Resumo gerado e inserido com sucesso!');
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