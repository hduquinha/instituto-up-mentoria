// Teste automatizado do webhook
const WEBHOOK_URL = 'https://up-n8n.welzbd.easypanel.host/webhook/a90b965c-7606-43eb-9d80-18e99bbd6718';

async function testarWebhookAutomatico() {
    const CLIENT_ID = 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    console.log('🧪 Iniciando teste automatizado do webhook...');
    console.log('🆔 CLIENT_ID:', CLIENT_ID);
    console.log('🔗 URL:', WEBHOOK_URL);
    
    const dadosTeste = {
        client_id: CLIENT_ID,
        session_id: CLIENT_ID,
        timestamp: new Date().toISOString(),
        step_completed: 0,
        plan: '',
        source: 'teste_automatico',
        interaction: 'automated_test',
        user_agent: 'Teste Automatizado',
        page_url: 'http://localhost:8000/teste',
        test_data: {
            nome: 'João Teste',
            email: 'joao@teste.com',
            telefone: '(11) 99999-9999',
            plano_interesse: 'Mentoria Individual'
        }
    };
    
    try {
        console.log('📤 Enviando dados para webhook...');
        console.log('📋 Dados:', JSON.stringify(dadosTeste, null, 2));
        
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dadosTeste)
        });
        
        const responseText = await response.text();
        
        console.log('📡 Status da resposta:', response.status);
        console.log('📥 Resposta do servidor:', responseText);
        
        if (response.ok) {
            console.log('✅ SUCESSO! Webhook está funcionando!');
            return {
                sucesso: true,
                status: response.status,
                resposta: responseText,
                client_id: CLIENT_ID
            };
        } else {
            console.log('❌ ERRO! Webhook retornou erro:', response.status);
            return {
                sucesso: false,
                status: response.status,
                erro: responseText,
                client_id: CLIENT_ID
            };
        }
        
    } catch (error) {
        console.error('❌ ERRO de conexão:', error.message);
        return {
            sucesso: false,
            erro: error.message,
            client_id: CLIENT_ID
        };
    }
}

// Executar teste
testarWebhookAutomatico().then(resultado => {
    console.log('🏁 Resultado final do teste:', resultado);
});