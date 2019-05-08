
// variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

//cart
let cart = []

//getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();

            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })
            return products
        } catch (error) {
            console.log(error)
        }
    }
}
// display products
class UI {
    displayProducts(products) {
        // console.log(products);

        let result = '';
        products.forEach(product => {
            result += `
                <!-- single product -->
                 <article class="product">
                    <div class="img-container">
                        <img 
                        src=${product.image} alt="product" 
                        class="product-img"
                        />
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fas fa-shopping-cart"></i>
                            add to basket
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>£${product.price}</h4>
                </article> 
                <!-- end of single product -->
                `;
        });

        productsDOM.innerHTML = result;
    }
    getBagButtons() {
        //turn to array
        const buttons = [...document.querySelectorAll('.bag-btn')]
        buttons.forEach(button => {
            let id = button.dataset.id;
            // console.log(id);
            let inCar = cart.find(item = > item.id === id);
            if (inCar) {
                button.innerText = "In Cart";
                button.disable = true;
            }
            button.addEventListener('click', (event) => {
                // console.log(event);
                event.target.innerText = "In Cart";
                event.target.disabled = true;
            });
        });
    }
}

// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    //get all products
    products.getProducts().then(products => {
        ui.displayProducts(products)
        Storage.saveProducts(products)
    }).then(() => {
        ui.getBagButtons();
    });
});

