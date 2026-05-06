async function testApi() {
  try {
    const res = await fetch('http://localhost:5000/api/products?limit=8');
    const data = await res.json();
    console.log('API Response Structure:', Object.keys(data));
    console.log('Products Count:', data.products?.length);
    console.log('First Product Name:', data.products?.[0]?.name);
  } catch (e) {
    console.error('API Fetch Failed:', e.message);
  }
}

testApi();
