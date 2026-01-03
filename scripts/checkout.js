import { cart, removeItem } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatMoney } from "./utils/money.js";
import { calculateCartQuantity } from "../data/cart.js";

let cartSummaryHTML= '';
cart.forEach((cartItem)=>{
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product)=>{
        if (product.id=== productId){
            matchingProduct= product;
        }
    })
       

     cartSummaryHTML += `
     <div class="cart-item-container item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
             ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatMoney(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                  Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary update-link"
              data-product-id="${matchingProduct.id}">
                  Update
              </span>
              <input type=text class="quantity-input"/>
              <span class="save-quantity-link link-primary">Save</span>
              <span class="delete-quantity-link link-primary delete-item"
              data-product-id="${matchingProduct.id}">
                  Delete
              </span>
            </div>
        </div>
     
        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${productId}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${productId}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${productId}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>  
    `;
})
document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

function attachEventListeners() {
  document.querySelectorAll('.delete-item').forEach((dink) => {
    dink.addEventListener('click', () => {
      const productId = dink.dataset.productId;
      removeItem(productId);
      const container = document.querySelector(`.item-container-${productId}`);
      container.remove();
    });
  });

  document.querySelectorAll('.update-link').forEach((link) => {
    console.log('Attaching update listener to:', link);
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.item-container-${productId}`);
      container.classList.add('is-editing-quantity');
    });
  });

  document.querySelectorAll('.save-quantity-link').forEach((savelink) => {
    savelink.addEventListener('click', () => {
      const container = savelink.closest('.cart-item-container');
      const productId= container.querySelector('.delete-item').dataset.productId;
    
     const newQuantity = parseInt(container.querySelector('.quantity-input').value);
     console.log(newQuantity);
     if (newQuantity > 0) {
           container.querySelector('.quantity-label').textContent = newQuantity;
     }
      container.classList.remove('is-editing-quantity');
    });
  });
}

attachEventListeners();

let cartQuantity = 0;
cart.forEach((cartItem) => {
  cartQuantity += cartItem.quantity;
});
document.querySelector('.item-quantity').innerHTML = `Checkout(${cartQuantity})` ;
