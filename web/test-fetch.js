async function test() {
  const url = 'https://vanguard-backend-yxd5.onrender.com/api/products/details/mens-slim-fit-denim-shirt-2';
  console.log('Fetching', url);
  try {
    const res = await fetch(url);
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
