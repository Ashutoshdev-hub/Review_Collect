  
   const link = document.createElement('link');
   link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap';
   link.rel = 'stylesheet';
   document.head.appendChild(link);

   
   function getRandomColor() {
       const colors = [
           '#4a90e2', '#9013fe', '#e74c3c', '#2ecc71', 
           '#3498db', '#9b59b6', '#f1c40f', '#e67e22'
       ];
       return colors[Math.floor(Math.random() * colors.length)];
   }

   
   function generateAvatar(name) {
       const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
       const avatar = document.createElement('div');
       avatar.className = 'avatar';
       avatar.style.background = getRandomColor();
       avatar.textContent = initials;
       avatar.dataset.name = name;
       return avatar.outerHTML;
   }

   
   function loadReviews() {
       const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
       const reviewGrid = document.getElementById('reviewGrid');
       reviewGrid.innerHTML = ''; // Clear existing reviews
       
       savedReviews.forEach((review, index) => addReviewToGrid(review, index));
       if (savedReviews.length === 0) {
           addReviewToGrid({ name: "John D.", rating: "5", comment: "Absolutely phenomenal experience! The product exceeded my expectations and the support team was incredibly helpful." }, 0);
       }
       animateCards();
       updateAvatars();
   }

  
   function addReviewToGrid(review, id) {
       const reviewGrid = document.getElementById('reviewGrid');
       const reviewCard = document.createElement('div');
       reviewCard.className = 'review-card';
       reviewCard.dataset.id = id;
       
       const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
       
       reviewCard.innerHTML = `
           <div class="review-header">
               ${generateAvatar(review.name)}
               <span class="user-name">${review.name}</span>
               <span class="stars">${stars}</span>
           </div>
           <p class="review-text">${review.comment}</p>
           <div class="review-actions">
               <button class="edit-btn">Edit</button>
               <button class="delete-btn">Delete</button>
           </div>
           <form class="edit-form">
               <div class="form-group">
                   <label>Rating</label>
                   <select class="edit-rating">
                       <option value="5" ${review.rating == 5 ? 'selected' : ''}>★★★★★ (5/5)</option>
                       <option value="4" ${review.rating == 4 ? 'selected' : ''}>★★★★☆ (4/5)</option>
                       <option value="3" ${review.rating == 3 ? 'selected' : ''}>★★★☆☆ (3/5)</option>
                       <option value="2" ${review.rating == 2 ? 'selected' : ''}>★★☆☆☆ (2/5)</option>
                       <option value="1" ${review.rating == 1 ? 'selected' : ''}>★☆☆☆☆ (1/5)</option>
                   </select>
               </div>
               <div class="form-group">
                   <label>Review</label>
                   <textarea class="edit-comment">${review.comment}</textarea>
               </div>
               <div class="review-actions">
                   <button type="submit" class="save-btn">Save</button>
                   <button type="button" class="cancel-btn">Cancel</button>
               </div>
           </form>
       `;
       
       reviewGrid.insertBefore(reviewCard, reviewGrid.firstChild);
   }

   
   function updateAvatars() {
       document.querySelectorAll('.avatar').forEach(avatar => {
           const name = avatar.dataset.name;
           avatar.style.background = getRandomColor();
           avatar.textContent = name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
       });
   }

   
   function animateCards() {
       const cards = document.querySelectorAll('.review-card');
       cards.forEach((card, index) => {
           setTimeout(() => {
               card.classList.add('show');
           }, index * 150);
       });
   }

  
   document.getElementById('reviewForm').addEventListener('submit', (e) => {
       e.preventDefault();
       
       const review = {
           name: document.getElementById('name').value,
           rating: document.getElementById('rating').value,
           comment: document.getElementById('comment').value
       };

       const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
       savedReviews.push(review);
       localStorage.setItem('reviews', JSON.stringify(savedReviews));

       addReviewToGrid(review, savedReviews.length - 1);
       animateCards();
       e.target.reset();
   });

 
   document.getElementById('reviewGrid').addEventListener('click', (e) => {
       const card = e.target.closest('.review-card');
       if (!card) return;
       const id = parseInt(card.dataset.id);
       const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];

       if (e.target.classList.contains('edit-btn')) {
           card.querySelector('.review-header').style.display = 'none';
           card.querySelector('.review-text').style.display = 'none';
           card.querySelector('.review-actions').style.display = 'none';
           card.querySelector('.edit-form').style.display = 'block';
       }

       if (e.target.classList.contains('cancel-btn')) {
           card.querySelector('.review-header').style.display = 'flex';
           card.querySelector('.review-text').style.display = 'block';
           card.querySelector('.review-actions').style.display = 'flex';
           card.querySelector('.edit-form').style.display = 'none';
       }

       if (e.target.classList.contains('delete-btn')) {
           if (confirm('Are you sure you want to delete this review?')) {
               savedReviews.splice(id, 1);
               localStorage.setItem('reviews', JSON.stringify(savedReviews));
               card.remove();
               // Update IDs of remaining cards
               document.querySelectorAll('.review-card').forEach((c, i) => c.dataset.id = i);
           }
       }
   });

   
   document.getElementById('reviewGrid').addEventListener('submit', (e) => {
       e.preventDefault();
       if (!e.target.classList.contains('edit-form')) return;

       const card = e.target.closest('.review-card');
       const id = parseInt(card.dataset.id);
       const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];

       const updatedReview = {
           name: savedReviews[id].name, // Name remains unchanged
           rating: card.querySelector('.edit-rating').value,
           comment: card.querySelector('.edit-comment').value
       };

       savedReviews[id] = updatedReview;
       localStorage.setItem('reviews', JSON.stringify(savedReviews));

       const stars = '★'.repeat(updatedReview.rating) + '☆'.repeat(5 - updatedReview.rating);
       card.querySelector('.stars').textContent = stars;
       card.querySelector('.review-text').textContent = updatedReview.comment;

       card.querySelector('.review-header').style.display = 'flex';
       card.querySelector('.review-text').style.display = 'block';
       card.querySelector('.review-actions').style.display = 'flex';
       card.querySelector('.edit-form').style.display = 'none';
   });

 
   function addHoverEffects() {
       const cards = document.querySelectorAll('.review-card');
       cards.forEach(card => {
           card.addEventListener('mouseenter', () => {
               if (!card.querySelector('.edit-form').style.display === 'block') {
                   card.style.transform = 'translateY(-10px) scale(1.02)';
                   card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
               }
           });
           card.addEventListener('mouseleave', () => {
               card.style.transform = 'translateY(0) scale(1)';
               card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
           });
       });
   }


   document.addEventListener('DOMContentLoaded', () => {
       loadReviews();
       addHoverEffects();
   });