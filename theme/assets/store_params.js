//
// The affiliate conversion tracking demo - theme side (get data, store into cart attributes)
//
// [How to use]
// 1. Create "store-params.js" under your theme's "assets" folder
// 2. Copy this file contents into "store-params.js"
// 3. Add below line to layout/theme.liquid, in the header section
//         <script src="{{ 'store-params.js' | asset_url }}" defer="defer"></script>
// 4. Implement a custom Pixel event within Checkout to send the info
//

// Affiliate IDs to deal with
//   TODO: modify for your system
const KEY_DATA_A = "id_a";
const KEY_DATA_B = "id_b";

// Reads all parameters and store into session storage
function storeUrlParameters() {
  // URL params
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);
  // Session storage
  const storage = window.sessionStorage;
  console.log(storage);
  // Store URL param into session storage
  for (const [key, value] of urlParams) {  
    if( key === KEY_DATA_A || key === KEY_DATA_B ) {
      storage.setItem(key, value);
      console.log("in storage - ", key, " : ", storage.getItem(key));
    }
  }
  // Write into cart attributes
  // NOTE:
  //    Since Cart object appears always present when visiting a Shopify store, 
  //    we may not need to use sessionStorage at all...
  //    I leave the use of sessionStorage anyway, just in case you want to write 
  //    attributes into the cart in another page than landing page with affiliate info.
  writeSessionStorageIntoCartAttribute();
}

// Adding affiliate ID's stored in sessionStorage into Shopify's Cart object
//   This examples writes values of "id_a" and "id_b" into the Cart's attribute 
//    with Ajax Cart API.
//    It also demonstrates how to create private cart attributes 
//    (ref: https://shopify.dev/docs/api/ajax/reference/cart#private-cart-attributes)
async function writeSessionStorageIntoCartAttribute() {
  // Session storage
  const storage = window.sessionStorage;
  // Get data
  const data_a = storage.getItem(KEY_DATA_A);
  const data_b = storage.getItem(KEY_DATA_B);
  if(!data_a || !data_b) {
    console.log("Data not found in storage.");
    return;
  }

  // Append double-understore to the key to hide attributes
  const key_a = `__${KEY_DATA_A}`;
  const key_b = `__${KEY_DATA_B}`;  
  // Input to Cart API
  // Note: wrap variable w/ [] to use variable's value as a JSON key
  const body = {
    attributes: {
      [key_a] : data_a,
      [key_b] : data_b 
    }
  };
  console.log(body);
  // Use Ajax Cart API to add cart attriutes  
  await fetch('/cart/update.js', {
     method: "POST",
     headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;'
     },
     body: JSON.stringify(body)
  })
  .catch((e) => {
    console.log("Error in /cart/update.js :", e);
    return;
  });
  
  // Clear data from session storage to avoid duplicate affiliations
  storage.removeItem(KEY_DATA_A);
  storage.removeItem(KEY_DATA_B);
}


//
// Call the function whenever a page is loaded
//
window.addEventListener('DOMContentLoaded', () => {
  storeUrlParameters();
});

