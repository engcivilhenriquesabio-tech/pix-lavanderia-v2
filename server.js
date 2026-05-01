const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// 🔐 CONFIG
const ACCESS_TOKEN = 'APP_USR-676309850173258-042921-a6849f3e25ccce1aeef9eac881edcb11-349504211';
const BASE_URL = 'https://pix-lavanderia-v2-production.up.railway.app';

// 🔹 ROTA TESTE
app.get('/', (req, res) => {
  res.send('Servidor online 🚀');
});

// 🔹 CRIAR PAGAMENTO
app.get('/criar-pix', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      {
        items: [
          {
            title: "Sacola Lavanderia",
            quantity: 1,
            unit_price: 9.90
          }
        ],
        notification_url: `${BASE_URL}/webhook`
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      }
    );

    res.redirect(response.data.init_point);

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.send("Erro ao gerar pagamento");
  }
});

// 🔹 WEBHOOK
app.post('/webhook', async (req, res) => {
  try {
    console.log("Webhook:", req.body);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 🔹 SERVIDOR
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log("Rodando na porta", PORT);
});