var eventBus = new Vue()
Vue.component('product', {
    props: {
      premium: {
        type: Boolean,
        required: true
      }
    },
    template: `
     <div class="product">
          
        <div class="product-image">
          <img :src="image">
        </div>
  
        <div class="product-info">
            <h1>{{ product }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>
            <p>Shipping: {{ shipping }}</p>
  
            <ul>
              <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
            </ul>
  
            <div class="color-box"
                 v-for="(variant, index) in variants" 
                 :key="variant.variantId"
                 :style="{ backgroundColor: variant.variantColor }"
                 @mouseover="updateProduct(index)"
                 >
            </div> 
  
            <button @click="addToCart" 
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
              >
            Add to cart
            </button>
  
         </div> 
         <product-tabs :reviews="reviews"></product-tabs>
        
      
      </div>
     `,
    data() {
      return {
          product: 'Socks',
          brand: 'Vue Mastery',
          selectedVariant: 0,
          details: ['80% cotton', '20% polyester', 'Gender-neutral'],
          variants: [
            {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: './vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor:"blue",
                    variantImage: './vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
      },
        methods: {
          addToCart() {
              this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
          },
          updateProduct(index) {  
              this.selectedVariant = index
          }
          
        },
        computed: {
            title() {
                return this.brand + ' ' + this.product  
            },
            image(){
                return this.variants[this.selectedVariant].variantImage
            },
            inStock(){
                return this.variants[this.selectedVariant].variantQuantity
            },
            shipping() {
              if (this.premium) {
                return "Free"
              }
                return 2.99
            }
        },
        mounted(){
            eventBus.$on('review-submitted', productReview => {
                this.reviews.push(productReview)
        })
    }
    })
  
  
    Vue.component('product-review', {
      template: `
        <form class="review-form" @submit.prevent="onSubmit">
        
          <p class="error" v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
  
          <p>
            <label for="name">Name:</label>
            <input class="name" v-model="name">
          </p>
          
          <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="review"></textarea>
          </p>
          
          <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
              <option>5</option>
              <option>4</option>
              <option>3</option>
              <option>2</option>
              <option>1</option>
            </select>
          </p>
              
          <p>
            <input type="submit" value="Submit">  
          </p>    
        
      </form>
      `,
      data() {
        return {
          name: null,
          review: null,
          rating: null,
          errors: []
        }
      },
      methods: {
        onSubmit() {
          if (this.name && this.review && this.rating) {
            let productReview = {
              name: this.name,
              review: this.review,
              rating: this.rating
            }
            eventBus.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
          } else {
            if (!this.name) this.errors.push("Name required.")
            if (!this.review) this.errors.push("Review required.")
            if (!this.rating) this.errors.push("Rating required.")
          }
        }
      }
    })
    
    Vue.component('product-tabs', {
        props: {
            reviews: {
              type: Array,
              required: false
            }
          },
        template: `
        <div>
          
        <div>
          <span class="tab" 
                v-for="(tab, index) in tabs"
                @click="selectedTab = index"
          >{{ tab }}</span>
        </div>
        
        <div v-show="selectedTab === 'Review'"> // displays when "Reviews" is clicked
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                  <p>{{ review.name }}</p>
                  <p>Rating:{{ review.rating }}</p>
                  <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
        
        <div v-show="selectedTab === 'Make a Review'"> // displays when "Make a Review" 
        </product-review>        
        </div>
    
      </div>
`,
        data() {
          return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'  // set from @click
          }
        }
      })
    var app = new Vue({
        el: '#app',
        data: {
          premium: true,
          cart: []
        },
        methods: {
          updateCart(id) {
            this.cart.push(id)
          }
        }
    })


