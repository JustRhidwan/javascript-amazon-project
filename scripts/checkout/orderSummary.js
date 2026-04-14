import { cart, removeItem, updateQuantity, calculateCartQuantity, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct} from "../../data/products.js";
import { formatMoney } from "../utils/money.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryoption.js"; 
import { renderPaymentSummary } from "./paymentSummary.js";

/*   hello();
      const today = dayjs();
      const deliveryDate = today.add(7, 'day').format('dddd, MMMM D');  
      console.log('Delivery Date:', deliveryDate);
*/

export function renderOrderSummary() {
  let cartSummaryHTML= '';
  cart.forEach((cartItem)=>{
      const productId = cartItem.productId;
      const matchingProduct = getProduct(productId);

      const deliveryOptionId = cartItem.deliveryOptionId;

      const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(
          deliveryOption.deliveryDays,
          'days'
          );
        const dateString = deliveryDate.format('dddd, MMMM D');

  // const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${(formatMoney(deliveryOption.priceCents))} -`;

    
      cartSummaryHTML += `
      <div class="cart-item-container item-container-${matchingProduct.id}">
          <div class="delivery-date">
          Delivery Date : ${dateString}
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
                <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                <span class="save-quantity-link link-primary"
                data-product-id="${matchingProduct.id}">Save</span>
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
          
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>  
      `;
  });
  function deliveryOptionsHTML (matchingProduct, cartItem) {

    let html = '';
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOption.priceCents === 0
    ? 'FREE' :
      `$${(formatMoney(deliveryOption.
        priceCents))} -`;

    
    const isChecked = deliveryOption.id ===  cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
        ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `
  });
    return html;
  }
  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  function attachEventListeners() {
    document.querySelectorAll('.delete-item').forEach((dink) => {
      dink.addEventListener('click', () => {
        const productId = dink.dataset.productId;
        removeItem(productId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

    document.querySelectorAll('.update-link').forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const container = document.querySelector(`.item-container-${productId}`);
        container.classList.add('is-editing-quantity');
      });
    });

    document.querySelectorAll('.save-quantity-link').forEach((savelink) => {
      savelink.addEventListener('click', () => {
        const container = savelink.closest('.cart-item-container');
        const productId = container.querySelector('.delete-item').dataset.productId;
        const quantityInput = container.querySelector('.quantity-input');
        const newQuantity = parseInt(quantityInput.value);

        if (newQuantity > 0 && newQuantity < 1000) {
          updateQuantity(productId, newQuantity);
          renderOrderSummary();
          renderPaymentSummary();
        } else {
          alert('Quantity must be between 1 and 999');
          renderOrderSummary();
        }
      });
    });

    document.querySelectorAll(".js-delivery-option")
      .forEach((element) => {
        element.addEventListener('click', () => {
          const { productId, deliveryOptionId } = element.dataset;
          updateDeliveryOption(productId, deliveryOptionId);
          renderOrderSummary();
          renderPaymentSummary();
        })
      });
  }

  attachEventListeners();
  
  document.querySelector('.item-quantity').innerHTML = `Checkout(${calculateCartQuantity()})` ;
}
