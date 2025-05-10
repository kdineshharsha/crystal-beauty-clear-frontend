export default function getCart() {
  let cart = localStorage.getItem("cart");

  if (!cart) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    try {
      cart = JSON.parse(cart);
    } catch (error) {
      console.error("Cart parsing error:", error);
      cart = [];
    }
  }

  return cart;
}

export function addToCart(product, qty) {
  let cart = getCart();

  const productIndex = cart.findIndex((p) => p.productId === product.productId);

  if (productIndex === -1) {
    cart.push({
      productId: product.productId,
      name: product.name,
      altNames: product.altNames,
      description: product.description,
      image: product.image[0],
      price: product.price,
      labeledPrice: product.labeledPrice,
      quantity: qty,
    });
  } else {
    cart[productIndex].quantity += qty;

    if (cart[productIndex].quantity <= 0) {
      cart = cart.filter((p) => p.productId !== product.productId);
    }
  }
  console.log(cart);

  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
}

export function removeFromCart(productId) {
  let cart = getCart();
  const newCart = cart.filter((product) => product.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(newCart));
  return newCart;
}

export function getTotal() {
  let cart = getCart();
  let total = 0;
  cart.forEach((product) => {
    total += product.price * product.quantity;
  });
  return total;
}

export function getTotalForLabeledPrice() {
  let cart = getCart();
  let total = 0;
  cart.forEach((product) => {
    total += product.labeledPrice * product.quantity;
  });
  return total;
}
