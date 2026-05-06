async function testApi() {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    console.log('Total Products:', data.products?.length);
    console.log('Featured Products:', data.products?.filter(p => p.isFeatured).length);
    console.log('Active Products:', data.products?.filter(p => p.isActive).length);
  } catch (e) {
    console.error('API Fetch Failed:', e.message);
  }
}

testApi();
