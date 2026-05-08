import cartLang from './cart.json';
import homeLang from './home.json';
import productsLang from './products.json';
import productDetailsLang from './product_details.json';
import blogLang from './blog.json';
import profileLang from './profile.json';
import navbarLang from './navbar.json';
import wishlistLang from './wishlist.json';
import footerLang from './footer.json';
import authLang from './auth.json';










// Future expansion: Add more page languages here
const langMaps = {
  cart: cartLang,
  home: homeLang,
  products: productsLang,
  product_details: productDetailsLang,
  blog: blogLang,
  profile: profileLang,
  navbar: navbarLang,
  wishlist: wishlistLang,
  footer: footerLang,
  auth: authLang,
};

export const getTranslation = (page, lang = 'en') => {
  const map = langMaps[page];
  if (!map) return {};
  return map[lang] || map['en'] || {};
};
