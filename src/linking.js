// const config = {
//     screens: {
//         ProductDetails: {
//             path: "productdetails/:productURL",
//             parse: {
//                 productURL: (productURL) => `${productURL}`,
//             //id: (id) => `${id}`,
//             },
//         }
//     },
//   };
  
  const linking = {
    prefixes: ["https://usdfab.com/usd/"],
    User: {
        screen: "ProductDetails",
        path: "productdetails/:productURL",
            parse: {
                productURL: (productURL) => `${productURL}`,
            //id: (id) => `${id}`,
            },
      }
  };
  
  export default linking;
  