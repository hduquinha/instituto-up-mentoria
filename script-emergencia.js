// Script de Emergência - Instituto UP
console.log('🚨 Script de emergência carregando...');

// Variáveis globais simples
let currentStep = 0;
const totalSteps = 8;
let selectedPlan = '';
const CLIENT_ID = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
const WEBHOOK_URL = 'https://up-n8n.welzbd.easypanel.host/webhook/a90b965c-7606-43eb-9d80-18e99bbd6718';

console.log('🆔 CLIENT_ID:', CLIENT_ID);

// Função para coletar todos os dados do formulário
function coletarTodosDados() {
    const dados = {
        // Modalidade
        modalidade: selectedPlan,
        modalidade_completa: selectedPlan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual',
        
        // Dados pessoais
        dados_pessoais: {
            nome: document.getElementById('nome')?.value || null,
            instagram: document.getElementById('instagram')?.value || null,
            telefone: document.getElementById('telefone')?.value || null,
            cidade: document.getElementById('cidade')?.value || null,
            idade: document.getElementById('idade')?.value || null,
            profissao: document.getElementById('profissao')?.value || null
        },
        
        // Obstáculos
        obstaculos: document.getElementById('obstaculos')?.value || null,
        
        // Objetivo principal
        objetivo_principal: document.querySelector('input[name="objetivo_principal"]:checked')?.value || null,
        
        // Situações de estresse (múltiplas)
        situacoes_estresse: Array.from(document.querySelectorAll('input[name="situacoes_estresse"]:checked')).map(sit => sit.value),
        situacoes_estresse_outro: document.querySelector('input[name="situacoes_estresse_outro"]')?.value || null,
        
        // Habilidade de Inteligência Emocional
        inteligencia_emocional: document.getElementById('inteligencia_emocional')?.value || null,
        
        // Visão de futuro
        visao_futuro: document.getElementById('visao_futuro')?.value || null,
        
        // Comprometimento
        comprometimento: document.querySelector('input[name="comprometimento"]:checked')?.value || null,
        
        // Confiança (múltiplas escalas)
        confianca: {
            opiniao: document.querySelector('input[name="confianca_opiniao"]:checked')?.value || null,
            feedback: document.querySelector('input[name="confianca_feedback"]:checked')?.value || null,
            publico: document.querySelector('input[name="confianca_publico"]:checked')?.value || null,
            assertividade: document.querySelector('input[name="confianca_assertividade"]:checked')?.value || null
        }
    };
    
    return dados;
}

// Função de webhook melhorada
async function sendWebhook(step, data = {}) {
    try {
        // Coletar TODOS os dados do formulário
        const todosOsDados = coletarTodosDados();
        
        const payload = {
            client_id: CLIENT_ID,
            timestamp: new Date().toISOString(),
            step_completed: step,
            user_agent: navigator.userAgent,
            session_data: todosOsDados,  // TODOS os dados coletados
            current_step_info: data,     // Info específica do step atual
            progress_percentage: (step / totalSteps) * 100,
            ...data
        };
        
        console.log('📤 ENVIANDO WEBHOOK COMPLETO:', payload);
        
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        console.log('📡 Webhook response:', response.status);
        return response.ok;
        
    } catch (error) {
        console.error('❌ Erro webhook:', error);
        return false;
    }
}

// Função nextStep melhorada
function nextStep() {
    console.log('⏭️ NEXT STEP chamada! Current:', currentStep);
    
    let stepData = {};
    
    // Dados específicos por step
    switch(currentStep) {
        case 0:
            stepData = { action: 'welcome_completed', step_name: 'welcome' };
            break;
        case 1:
            stepData = { 
                action: 'plan_selection_completed', 
                step_name: 'plan_selection',
                plan_selected: selectedPlan 
            };
            break;
        case 2:
            stepData = { 
                action: 'personal_data_completed', 
                step_name: 'personal_data'
            };
            break;
        case 3:
            stepData = { 
                action: 'diagnostics_completed', 
                step_name: 'diagnostics'
            };
            break;
        case 4:
            stepData = { 
                action: 'future_vision_completed', 
                step_name: 'future_vision'
            };
            break;
        case 5:
            stepData = { 
                action: 'final_assessment_completed', 
                step_name: 'final_assessment'
            };
            break;
        case 6:
            stepData = { 
                action: 'summary_displayed', 
                step_name: 'summary'
            };
            break;
        case 7:
            stepData = { 
                action: 'questionnaire_completed', 
                step_name: 'completion'
            };
            break;
    }
    
    if (currentStep < totalSteps - 1) {
        currentStep++;
        console.log('✅ Avançando para step:', currentStep);
        
        // Enviar webhook com todos os dados
        sendWebhook(currentStep, stepData);
        
        showStep(currentStep);
        
        // Se chegou no resumo (step 6)
        if (currentStep === 6) {
            console.log('📋 Gerando resumo...');
            setTimeout(() => {
                gerarResumoSimples();
            }, 500);
        }
    } else {
        console.log('🏁 Finalizado!');
        sendWebhook(totalSteps, { 
            action: 'completed', 
            step_name: 'final_completion',
            completion_timestamp: new Date().toISOString()
        });
    }
}

// Função prevStep simples
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

// Função showStep simples
function showStep(step) {
    console.log('👁️ Mostrando step:', step);
    const steps = document.querySelectorAll('.form-step');
    
    steps.forEach((element, index) => {
        if (index === step) {
            element.style.display = 'block';
            element.classList.add('active');
        } else {
            element.style.display = 'none';
            element.classList.remove('active');
        }
    });
    
    // Atualizar progress bar
    const progressFill = document.getElementById('progressFill');
    const currentStepEl = document.getElementById('currentStep');
    
    if (progressFill && currentStepEl) {
        const progress = Math.min((step / 7) * 100, 100);
        progressFill.style.width = progress + '%';
        currentStepEl.textContent = Math.min(step + 1, 7);
    }
}

// Função selectPlan simples
function selectPlan(plan) {
    console.log('🎯 Plan selecionado:', plan);
    selectedPlan = plan;
    
    // Visual feedback
    document.querySelectorAll('.plan-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`[data-plan="${plan}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Habilitar botão
    const btn = document.getElementById('planContinueBtn');
    if (btn) {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.style.background = '#FF6B35';
    }
    
    // Enviar webhook imediatamente
    sendWebhook(1, {
        plan_selected: plan,
        plan_name: plan === 'grupo' ? 'Mentoria em Grupo' : 'Mentoria Individual'
    });
}

// Função para gerar resumo simples
function gerarResumoSimples() {
    console.log('📋 Gerando resumo simples...');
    
    const container = document.getElementById('summaryContent');
    if (!container) {
        console.error('❌ Container não encontrado');
        return;
    }
    
    // Usar a função gerarResumo() mais completa
    const resumoDetalhado = gerarResumo();
    
    const resumoHTML = `
        <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
            <h3 style="color: #1B365D; margin-bottom: 20px;">📋 Resumo do Questionário</h3>
            
            <div style="margin: 15px 0; padding: 15px; background: rgba(255, 107, 53, 0.05); border-left: 4px solid #FF6B35; border-radius: 0 10px 10px 0;">
                ${resumoDetalhado}
            </div>
            
            <div style="margin: 15px 0; padding: 15px; background: rgba(255, 107, 53, 0.05); border-left: 4px solid #FF6B35; border-radius: 0 10px 10px 0;">
                <h4 style="color: #1B365D; margin: 0 0 10px 0;">✅ Status</h4>
                <div class="resume-item"><strong>CLIENT_ID:</strong> ${CLIENT_ID}</div>
                <div class="resume-item"><strong>Data:</strong> ${new Date().toLocaleDateString()}</div>
                <div class="resume-item"><strong>Questionário:</strong> Completo</div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #1B365D, #2c5282); color: white; border-radius: 15px;">
                <h4 style="color: #FFB830; margin: 0 0 10px 0;">🎉 Parabéns!</h4>
                <p style="margin: 0;">Questionário finalizado com sucesso! Nossa equipe entrará em contato em breve.</p>
            </div>
        </div>
    `;
    
    container.innerHTML = resumoHTML;
    console.log('✅ Resumo gerado!');
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM carregado - Script de emergência');
    
    // Mostrar primeiro step
    showStep(0);
    
    // Webhook inicial
    sendWebhook(0, {
        action: 'questionnaire_started',
        timestamp: new Date().toISOString()
    });
    
    // Event listeners para planos
    const planOptions = document.querySelectorAll('.plan-option');
    planOptions.forEach(option => {
        option.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            if (plan) selectPlan(plan);
        });
    });
    
    console.log('🚀 Script de emergência inicializado!');
});

// Função para gerar resumo do formulário
function gerarResumo() {
    const dados = coletarTodosDados();
    let resumoHTML = '';
    
    // Modalidade selecionada
    if (dados.modalidade) {
        resumoHTML += `<div class="resume-item"><strong>Modalidade:</strong> ${dados.modalidade_completa || dados.modalidade}</div>`;
    }
    
    // Dados pessoais
    if (dados.dados_pessoais.nome) {
        resumoHTML += `<div class="resume-item"><strong>Nome:</strong> ${dados.dados_pessoais.nome}</div>`;
    }
    if (dados.dados_pessoais.instagram) {
        resumoHTML += `<div class="resume-item"><strong>Instagram:</strong> ${dados.dados_pessoais.instagram}</div>`;
    }
    if (dados.dados_pessoais.telefone) {
        resumoHTML += `<div class="resume-item"><strong>Telefone:</strong> ${dados.dados_pessoais.telefone}</div>`;
    }
    if (dados.dados_pessoais.cidade) {
        resumoHTML += `<div class="resume-item"><strong>Cidade:</strong> ${dados.dados_pessoais.cidade}</div>`;
    }
    if (dados.dados_pessoais.idade) {
        resumoHTML += `<div class="resume-item"><strong>Idade:</strong> ${dados.dados_pessoais.idade} anos</div>`;
    }
    if (dados.dados_pessoais.profissao) {
        resumoHTML += `<div class="resume-item"><strong>Profissão:</strong> ${dados.dados_pessoais.profissao}</div>`;
    }
    
    // Objetivo principal
    if (dados.objetivo_principal) {
        const objetivos = {
            'gerenciar_ansiedade': 'Gerenciar Ansiedade e Estresse',
            'inteligencia_emocional': 'Desenvolver Inteligência Emocional',
            'foco_performance': 'Melhorar Foco e Performance',
            'comunicacao_influencia': 'Aprimorar Comunicação e Influência',
            'equilibrio_vida': 'Encontrar Equilíbrio Vida-Trabalho'
        };
        resumoHTML += `<div class="resume-item"><strong>Objetivo Principal:</strong> ${objetivos[dados.objetivo_principal] || dados.objetivo_principal}</div>`;
    }
    
    // Situações de estresse
    if (dados.situacoes_estresse && dados.situacoes_estresse.length > 0) {
        const situacoes = {
            'reunioes_apresentacoes': 'Reuniões e Apresentações',
            'decisoes_risco': 'Decisões de Alto Risco',
            'feedbacks_dificeis': 'Feedbacks Difíceis',
            'conflitos_equipe': 'Conflitos com Equipe',
            'pressao_constante': 'Pressão Constante'
        };
        const listaSituacoes = dados.situacoes_estresse.map(sit => situacoes[sit] || sit).join(', ');
        resumoHTML += `<div class="resume-item"><strong>Situações de Estresse:</strong> ${listaSituacoes}</div>`;
    }
    
    // Comprometimento
    if (dados.comprometimento) {
        resumoHTML += `<div class="resume-item"><strong>Nível de Comprometimento:</strong> ${dados.comprometimento}/10</div>`;
    }
    
    // Confiança (média)
    if (dados.confianca) {
        const confiancaValues = Object.values(dados.confianca).filter(v => v !== null);
        if (confiancaValues.length > 0) {
            const media = (confiancaValues.reduce((acc, val) => acc + parseInt(val), 0) / confiancaValues.length).toFixed(1);
            resumoHTML += `<div class="resume-item"><strong>Nível Médio de Confiança:</strong> ${media}/5</div>`;
        }
    }
    
    return resumoHTML;
}

// Função para submeter o formulário
function submitForm() {
    console.log('🎯 SUBMIT FORM chamada!');
    
    try {
        // Gerar resumo
        const resumo = gerarResumo();
        const summaryContainer = document.getElementById('summaryContent');
        if (summaryContainer) {
            summaryContainer.innerHTML = resumo;
        }
        
        // Enviar webhook final
        sendWebhook('form_completed', {
            action: 'form_submitted',
            step_name: 'form_completion',
            completion_timestamp: new Date().toISOString()
        }).then(success => {
            if (success) {
                console.log('✅ Formulário enviado com sucesso!');
                nextStep(); // Ir para a página de sucesso
            } else {
                console.log('⚠️ Webhook falhou, mas continuando...');
                nextStep(); // Continuar mesmo se webhook falhar
            }
        });
        
    } catch (error) {
        console.error('❌ Erro ao submeter formulário:', error);
        // Continuar mesmo com erro
        nextStep();
    }
}

console.log('✅ Script de emergência carregado!');