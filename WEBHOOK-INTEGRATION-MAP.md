# 📊 MAPA COMPLETO DE WEBHOOKS - Instituto UP

## 🔄 Fluxo de Integração Webhook por Step

### 📡 **WEBHOOK 0** - Inicialização
**Quando:** Usuário acessa o questionário
```json
{
  "client_id": "client_1728123456789_abc123def",
  "step_completed": 0,
  "interaction": "questionnaire_started",
  "user_agent": "Mozilla/5.0...",
  "referrer": "direct",
  "page_url": "http://localhost:8000/questionario.html",
  "source": "questionario_completo"
}
```

### 📡 **WEBHOOK 0.5** - Seleção de Plano
**Quando:** Usuário clica em uma modalidade
```json
{
  "client_id": "client_1728123456789_abc123def",
  "step_completed": 0.5,
  "plan": "Mentoria Individual",
  "interaction": "plan_selected",
  "plan_selection_time": "2025-10-03T10:31:15.456Z"
}
```

### 📡 **WEBHOOK 1** - Confirmação do Plano
**Quando:** Usuário clica "Continuar" após selecionar plano
```json
{
  "client_id": "client_1728123456789_abc123def",
  "step_completed": 1,
  "plan": "Mentoria Individual",
  "conversion_step": "plan_confirmed",
  "progress_percentage": 16.67
}
```

### 📡 **WEBHOOK 2** - Dados Pessoais Completos
**Quando:** Usuário preenche todos os dados pessoais
```json
{
  "client_id": "client_1728123456789_abc123def",
  "step_completed": 2,
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "phone": "(11) 99999-9999",
  "city": "São Paulo",
  "age": "35",
  "profession": "Gerente de Vendas",
  "obstacles": "Dificuldade em liderar equipes",
  "conversion_step": "personal_data_completed",
  "progress_percentage": 33.33
}
```

### 📡 **WEBHOOK 3** - Diagnóstico Completo
**Quando:** Usuário completa avaliação diagnóstica
```json
{
  "client_id": "client_1728123456789_abc123def",
  "step_completed": 3,
  "main_objective": "inteligencia_emocional",
  "stress_situations": ["reunioes", "confrontos", "prazos"],
  "emotional_intelligence": "4",
  "conversion_step": "diagnostic_completed",
  "progress_percentage": 50
}
```

### 📡 **WEBHOOK 4** - Visão de Futuro
**Quando:** Usuário define objetivos e autoavaliação
```json
{
  "client_id": "client_1728123456789_abc123def",
  "step_completed": 4,
  "future_vision": "Ser um líder confiante e respeitado",
  "commitment_level": "8",
  "confidence_scores": {
    "expressing_opinions": "6",
    "difficult_conversations": "4",
    "public_speaking": "3",
    "assertiveness": "5"
  },
  "conversion_step": "future_vision_completed",
  "progress_percentage": 66.67
}
```

### 📡 **WEBHOOK 5** - Revisão do Resumo
**Quando:** Usuário visualiza resumo dos dados
```json
{
  "client_id": "client_1728123456789_abc123def",
  "step_completed": 5,
  "conversion_step": "summary_reviewed",
  "progress_percentage": 83.33,
  "ready_for_submission": true
}
```

### 📡 **WEBHOOK 6** - Submissão Final
**Quando:** Usuário finaliza questionário
```json
{
  "client_id": "client_1728123456789_abc123def",
  "step_completed": 6,
  "status": "completed",
  "conversion_step": "questionnaire_submitted",
  "completion_time": "2025-10-03T10:38:00.901Z",
  "progress_percentage": 100,
  "total_time_spent": 420000,
  
  // TODOS OS DADOS COMPILADOS:
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "phone": "(11) 99999-9999",
  "city": "São Paulo",
  "age": "35",
  "profession": "Gerente de Vendas",
  "obstacles": "Dificuldade em liderar equipes",
  "plan": "Mentoria Individual",
  "main_objective": "inteligencia_emocional",
  "stress_situations": ["reunioes", "confrontos", "prazos"],
  "emotional_intelligence": "4",
  "future_vision": "Ser um líder confiante e respeitado",
  "commitment_level": "8",
  "confidence_scores": {
    "expressing_opinions": "6",
    "difficult_conversations": "4", 
    "public_speaking": "3",
    "assertiveness": "5"
  }
}
```

### 📡 **WEBHOOK ABANDONO** - Saída Antecipada
**Quando:** Usuário fecha página antes de completar
```json
{
  "client_id": "client_1728123456789_abc123def",
  "step_completed": 2.1,
  "interaction": "questionnaire_abandoned",
  "last_step": 2,
  "time_spent": 180000,
  // Dados parciais coletados até o momento
}
```

## 🎯 **BENEFÍCIOS DA INTEGRAÇÃO COMPLETA**

### 📈 **Para Análise de Funil:**
- **Taxa de conversão por step**
- **Pontos de maior abandono**
- **Tempo médio por etapa**
- **Efetividade de cada pergunta**

### 🎪 **Para Follow-up:**
- **Recuperação de leads abandonados**
- **Segmentação por nível de interesse**
- **Personalização baseada em respostas**
- **Score de qualificação automático**

### 📊 **Para n8n Workflows:**
- **Trigger automático por step**
- **Dados progressivos para CRM**
- **Notificações para time de vendas**
- **Analytics em tempo real**

## 🚀 **TESTE COMPLETO**

Para testar todos os webhooks:
1. Acesse `questionario.html`
2. Abra console (F12)
3. Complete cada step
4. Verifique logs no console
5. Confirme recebimento no n8n

Cada step enviará um webhook específico com dados progressivos!