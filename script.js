/* Simple JS for interactions:
   - mobile menu toggle
   - Add to cart button handling (updates cart count)
   - Newsletter form validation
   - Build-your-own modal and live price calc
   - Smooth scroll for anchor links
*/

document.addEventListener('DOMContentLoaded', function () {
  // MENU TOGGLE (mobile)
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    // toggle a small class to show nav (CSS hides nav on small screens)
    if (nav.classList.contains('open')) {
      nav.style.display = 'block';
    } else {
      nav.style.display = '';
    }
  });

  // SMOOTH SCROLL for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile nav after click
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          nav.style.display = '';
        }
      }
    });
  });


  // CART: Add to cart buttons
  let cartCount = 0;
  const cartCountEl = document.getElementById('cart-count');
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = btn.dataset.name || 'Item';
      const price = parseFloat(btn.dataset.price || 0);
      cartCount++;
      cartCountEl.textContent = cartCount;
      // small user feedback - brief animation
      btn.textContent = 'Added ✓';
      setTimeout(() => btn.textContent = (btn.classList.contains('btn-add') ? 'Add to Cart' : 'Order Now'), 1400);
      // In real app: push to cart array, persist to localStorage, sync to backend
      console.info(`Added to cart: ${name} — $${price.toFixed(2)}`);
    });
  });

  // NEWSLETTER: simple validation
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterMsg = document.getElementById('newsletter-msg');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterEmail.value.trim();
    if (!validateEmail(email)) {
      newsletterMsg.textContent = 'Please enter a valid email address.';
      newsletterMsg.style.color = 'crimson';
      return;
    }
    // simulate API success
    newsletterMsg.textContent = 'Thanks for subscribing! Check your inbox.';
    newsletterMsg.style.color = 'green';
    newsletterEmail.value = '';
    // In production: send to Mailchimp or your mailing API
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // BUILDER MODAL
  const builderModal = document.getElementById('builder-modal');
  const openBuilder = document.getElementById('open-builder');
  const closeBuilder = document.getElementById('close-builder');
  const builderForm = document.getElementById('builder-form');
  const builderTotal = document.getElementById('builder-total');

  openBuilder.addEventListener('click', () => {
    builderModal.setAttribute('aria-hidden','false');
    calculateBuilderTotal();
  });
  closeBuilder.addEventListener('click', () => builderModal.setAttribute('aria-hidden','true'));
  builderModal.addEventListener('click', (e) => {
    if (e.target === builderModal) builderModal.setAttribute('aria-hidden','true');
  });

  // live price update for builder
  ['size','crust'].forEach(id => {
    document.getElementById(id).addEventListener('change', calculateBuilderTotal);
  });
  builderForm.querySelectorAll('input[type=checkbox]').forEach(box => box.addEventListener('change', calculateBuilderTotal));

  builderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // construct item name and price
    const sizeSelect = document.getElementById('size');
    const crustSelect = document.getElementById('crust');
    const toppings = Array.from(builderForm.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
    const price = parseFloat(builderTotal.dataset.price || 0);

    // simulate add to cart
    cartCount++;
    cartCountEl.textContent = cartCount;
    builderModal.setAttribute('aria-hidden','true');
    alert(`Added custom pizza (${sizeSelect.value}, ${crustSelect.value}${toppings.length?', '+toppings.join(', '):''}) — $${price.toFixed(2)}`);
  });

  function calculateBuilderTotal() {
    const sizeSelect = document.getElementById('size');
    const crustSelect = document.getElementById('crust');
    const toppingCheckboxes = builderForm.querySelectorAll('input[type=checkbox]');
    const sizePrice = parseFloat(sizeSelect.selectedOptions[0].dataset.price || 0);
    const crustPrice = parseFloat(crustSelect.selectedOptions[0].dataset.price || 0);
    const toppingsCount = Array.from(toppingCheckboxes).filter(ch => ch.checked).length;
    const toppingPrice = toppingsCount * 0.99;
    const total = sizePrice + crustPrice + toppingPrice;
    builderTotal.textContent = `$${total.toFixed(2)}`;
    builderTotal.dataset.price = total.toFixed(2);
  }

});
