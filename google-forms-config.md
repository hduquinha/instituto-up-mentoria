# Configuração do Google Forms para Mentoria

## 📋 Como criar o formulário no Google Forms:

### 1. Acesse o Google Forms:
- Vá para: https://forms.google.com
- Clique em "+" para criar um novo formulário

### 2. Configure o cabeçalho:
- **Título**: Reserva de Vaga - Mentoria de Autodomínio | Instituto UP
- **Descrição**: "🚀 Vagas limitadas! Preencha os dados abaixo para reservar sua vaga na nossa mentoria de autodomínio. Nossa equipe entrará em contato em até 24h para confirmar sua participação."

### 3. Adicione as seguintes perguntas:

#### Pergunta 1: Nome completo
- Tipo: Resposta curta
- Obrigatória: Sim

#### Pergunta 2: E-mail
- Tipo: Resposta curta
- Obrigatória: Sim
- Validação: Endereço de email

#### Pergunta 3: WhatsApp (com DDD)
- Tipo: Resposta curta
- Obrigatória: Sim

#### Pergunta 4: Profissão/Cargo
- Tipo: Resposta curta
- Obrigatória: Sim

#### Pergunta 5: Qual modalidade você tem mais interesse?
- Tipo: Múltipla escolha
- Obrigatória: Sim
- Opções:
  - Mentoria em Grupo (networking e suporte coletivo)
  - Mentoria Individual (atenção personalizada)
  - Ainda não sei, quero orientação da equipe

#### Pergunta 6: Qual seu principal objetivo com a mentoria?
- Tipo: Múltipla escolha
- Obrigatória: Sim
- Opções:
  - Controlar ansiedade e estresse
  - Parar de procrastinar
  - Melhorar minha liderança
  - Desenvolver alta performance
  - Desenvolver autoconhecimento
  - Outros

#### Pergunta 7: Qual sua disponibilidade de horário?
- Tipo: Múltipla escolha
- Obrigatória: Sim
- Opções:
  - Manhã (8h às 12h)
  - Tarde (12h às 18h)
  - Noite (18h às 22h)
  - Fins de semana
  - Horário flexível

#### Pergunta 8: Já participou de alguma mentoria ou coaching antes?
- Tipo: Múltipla escolha
- Obrigatória: Não
- Opções:
  - Sim, e foi uma experiência positiva
  - Sim, mas não tive bons resultados
  - Não, seria minha primeira vez

#### Pergunta 9: Observações adicionais
- Tipo: Parágrafo
- Obrigatória: Não
- Descrição: "Conte-nos mais sobre seus desafios ou expectativas..."

### 4. Configurações importantes:
- **Configurações** → **Apresentação**:
  - Mostrar barra de progresso: Ativado
  - Mensagem de confirmação: "🎉 Vaga reservada com sucesso! Nossa equipe entrará em contato em até 24h para confirmar sua participação na mentoria de autodomínio. Obrigado!"

- **Configurações** → **Respostas**:
  - Coletar endereços de email: Ativado
  - Limite a 1 resposta: Ativado
  - Permitir que os entrevistados editem depois de enviar: Ativado

### 5. Personalize o visual:
- **Tema**: Escolha cores que combinem com o Instituto UP (laranja/azul)
- **Imagem de cabeçalho**: Use a logo do Instituto UP se possível

### 6. Obtenha o link:
- Clique em "Enviar"
- Clique no ícone de link 🔗
- Marque "Encurtar URL"
- Copie o link gerado

### 7. Substitua no código:
No arquivo `index.html`, linha com o link do Google Forms, substitua:
```html
href="https://forms.gle/YOUR_GOOGLE_FORM_ID"
```

Por:
```html
href="SEU_LINK_DO_GOOGLE_FORMS_AQUI"
```

## 📊 Como acessar as respostas:
1. No Google Forms, clique na aba "Respostas"
2. Você pode ver um resumo ou respostas individuais
3. Para exportar: clique nos três pontos → "Baixar respostas (.csv)"

## 🔔 Configurar notificações:
1. Na aba "Respostas", clique nos três pontos
2. Selecione "Receber notificações por email de novas respostas"
3. Você receberá um email a cada novo lead!

## 📱 Integração com planilhas (opcional):
1. Na aba "Respostas", clique no ícone do Google Sheets
2. Crie uma nova planilha
3. Todas as respostas serão automaticamente organizadas