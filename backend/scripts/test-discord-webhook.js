/**
 * Script de test pour le webhook Discord
 * 
 * Usage:
 *   node scripts/test-discord-webhook.js
 * 
 * Ou avec des paramètres personnalisés:
 *   node scripts/test-discord-webhook.js --gameId=12345 --action=deposit --amount=1000.50
 *   node scripts/test-discord-webhook.js --username=johndoe --action=withdraw --amount=500
 *   node scripts/test-discord-webhook.js --url=https://votre-domaine.com --apiKey=ma-cle
 */

import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration par défaut
const config = {
  url: process.env.API_URL || 'http://localhost:3001',
  endpoint: '/api/discord/webhook',
  apiKey: process.env.DISCORD_WEBHOOK_KEY || process.env.GTARP_WEBHOOK_KEY || null,
};

// Parser les arguments de ligne de commande
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    gameId: '12345',
    username: null,
    action: 'deposit',
    amount: 1000.50,
    description: 'Test de transaction depuis script',
    category: 'Discord',
  };

  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      if (key === 'gameId') params.gameId = value;
      if (key === 'username') params.username = value;
      if (key === 'action') params.action = value;
      if (key === 'amount') params.amount = parseFloat(value);
      if (key === 'description') params.description = value;
      if (key === 'category') params.category = value;
      if (key === 'url') config.url = value;
      if (key === 'apiKey') config.apiKey = value;
    }
  });

  return params;
}

// Fonction pour faire la requête
function testWebhook(params) {
  return new Promise((resolve, reject) => {
    const url = new URL(config.endpoint, config.url);
    const isHttps = url.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    // Préparer les données
    const data = {
      action: params.action,
      amount: params.amount,
      description: params.description,
      category: params.category,
    };

    // Ajouter gameId ou username
    if (params.gameId) {
      data.gameId = params.gameId;
    }
    if (params.username) {
      data.username = params.username;
    }

    const postData = JSON.stringify(data);

    // Préparer les headers
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    };

    // Ajouter la clé API si configurée
    if (config.apiKey) {
      headers['X-API-Key'] = config.apiKey;
    }

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: headers,
    };

    console.log('\n🧪 Test du webhook Discord');
    console.log('═══════════════════════════════════════');
    console.log(`📍 URL: ${url.href}`);
    console.log(`📤 Données:`, JSON.stringify(data, null, 2));
    if (config.apiKey) {
      console.log(`🔑 Clé API: ${config.apiKey.substring(0, 10)}...`);
    } else {
      console.log(`⚠️  Aucune clé API configurée`);
    }
    console.log('───────────────────────────────────────\n');

    const req = httpModule.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseData);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Succès !');
            console.log(`📊 Statut: ${res.statusCode}`);
            console.log(`📦 Réponse:`, JSON.stringify(jsonResponse, null, 2));
            resolve(jsonResponse);
          } else {
            console.log('❌ Erreur !');
            console.log(`📊 Statut: ${res.statusCode}`);
            console.log(`📦 Réponse:`, JSON.stringify(jsonResponse, null, 2));
            reject(new Error(`Erreur ${res.statusCode}: ${jsonResponse.error || jsonResponse.message}`));
          }
        } catch (error) {
          console.log('❌ Erreur de parsing de la réponse');
          console.log(`📊 Statut: ${res.statusCode}`);
          console.log(`📦 Réponse brute:`, responseData);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Erreur de connexion !');
      console.log(`📦 Erreur:`, error.message);
      
      if (error.code === 'ECONNREFUSED') {
        console.log('\n💡 Astuce: Assurez-vous que le serveur backend est démarré sur', config.url);
      }
      
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Fonction principale
async function main() {
  try {
    const params = parseArgs();
    
    // Vérifier que gameId ou username est fourni et n'est pas la valeur par défaut
    if (!params.gameId && !params.username) {
      console.error('\n❌ Erreur: Vous devez fournir un gameId ou un username');
      console.error('\n💡 Utilisation:');
      console.error('   node scripts/test-discord-webhook.js --gameId=VOTRE_GAME_ID');
      console.error('   node scripts/test-discord-webhook.js --username=VOTRE_USERNAME');
      console.error('\n📋 Pour voir la liste des utilisateurs:');
      console.error('   node scripts/list-users.js\n');
      process.exit(1);
    }

    if (params.gameId === 'VOTRE_GAME_ID' || params.gameId === '12345') {
      console.warn('\n⚠️  Attention: Vous utilisez un gameId de test (12345)');
      console.warn('   Assurez-vous qu\'un utilisateur avec ce gameId existe dans la base de données.');
      console.warn('\n📋 Pour voir la liste des utilisateurs:');
      console.warn('   node scripts/list-users.js\n');
    }
    
    console.log('🚀 Démarrage du test du webhook Discord\n');
    
    await testWebhook(params);
    
    console.log('\n✨ Test terminé avec succès !\n');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Test échoué:', error.message);
    
    if (error.message.includes('404') || error.message.includes('Utilisateur non trouvé')) {
      console.error('\n💡 L\'utilisateur n\'existe pas dans la base de données.');
      console.error('📋 Pour voir la liste des utilisateurs:');
      console.error('   node scripts/list-users.js\n');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
      console.error('\n💡 Le serveur backend n\'est pas démarré.');
      console.error('   Démarrez-le avec: npm start\n');
    }
    
    process.exit(1);
  }
}

// Exécuter le script
main().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});

export { testWebhook };

