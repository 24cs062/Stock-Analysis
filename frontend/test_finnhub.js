const fs = require('fs');

async function testApi() {
  const apiKey = 'da2sil1r01qupvfalvc0da2sil1r01qupvfalvcg';
  let prevPrice = null;
  console.log('Testing AAPL quotes for 1 minute...');
  
  for (let i = 0; i < 6; i++) {
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${apiKey}`);
      const data = await res.json();
      console.log(`[${new Date().toLocaleTimeString()}] AAPL: ${data.c}`);
      if (prevPrice !== null && prevPrice !== data.c) {
        console.log('Price changed!');
      }
      prevPrice = data.c;
    } catch (e) {
      console.error(e);
    }
    await new Promise(r => setTimeout(r, 10000)); // wait 10s
  }
}

testApi();
