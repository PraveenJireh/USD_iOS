import Images from "./Images";
import { Colors } from "@themes";

const Constants = {
    API_BASE_URL : "https://usdfab.com/api/",
    API_KEY: "AIzaSyCgq3omQsyQakuQTJd2-EmQ4TJgDUsKCiw",
    SIDEBAR: [
        {
            id: "1",
            title: "Home",
            icon: Images.icons.home,
            routing: "Home"
        },
        {
            id: "2",
            title: "My Orders",
            icon: Images.icons.bag,
            routing: "MyOrders"
        },
        {
            id: "3",
            title: "Categories",
            icon: Images.icons.category,
            routing: "ListCategories"
        },
        {
            id: "4",
            title: "Profile",
            icon: Images.icons.settings,
            routing: "Profile"
        },
        {
            id: "5",
            title: "Wishlist",
            icon: Images.icons.heart,
            routing: "Wishlist"
        },
        {
            id: "6",
            title: "Seller Login",
            icon: Images.icons.login,
            routing: "SellerLogin"
        },
        {
            id: "7",
            title: "Sales Team Login",
            icon: Images.icons.login,
            routing: "SalesTeamLogin"
        },
        {
            id: "8",
            title: "FAQ and User Manual",
            icon: Images.icons.faq,
            routing: "FAQ"
        },
        {
            id: "9",
            title: "Legal Policy and Terms of Use",
            icon: Images.icons.legalPolicy,
            routing: "LegalPolicy"
        },
        {
            id: "10",
            title: "Customer Service",
            icon: Images.icons.customerService,
            routing: "CustomerService"
        },
        {
            id: "11",
            title: "Privacy Policy",
            icon: Images.icons.privacy,
            routing: "Privacy"
        },
        {
            id: "12",
            title: "Rate us",
            icon: Images.icons.star,
            routing: "RateUs"
        },
        {
            id: "13",
            title: "Invite Friends",
            icon: Images.icons.invite,
            routing: "InviteFriends"
        },
        {
            id: "14",
            title: "Logout",
            icon: Images.icons.logout,
            routing: "Logout"
        },
    ],
    SIDEBAR_WITHOUT_LOGIN: [
        {
            id: "1",
            title: "Home",
            icon: Images.icons.home,
            routing: "Home"
        },
        {
            id: "2",
            title: "Categories",
            icon: Images.icons.category,
            routing: "ListCategories"
        },
        {
            id: "3",
            title: "Seller Login",
            icon: Images.icons.login,
            routing: "SellerLogin"
        },
        {
            id: "4",
            title: "Sales Team Login",
            icon: Images.icons.login,
            routing: "SalesTeamLogin"
        },
        {
            id: "5",
            title: "FAQ and User Manual",
            icon: Images.icons.faq,
            routing: "FAQ"
        },
        {
            id: "6",
            title: "Legal Policy and Terms of Use",
            icon: Images.icons.legalPolicy,
            routing: "LegalPolicy"
        },
        {
            id: "7",
            title: "Customer Service",
            icon: Images.icons.customerService,
            routing: "CustomerService"
        },
        {
            id: "8",
            title: "Privacy Policy",
            icon: Images.icons.privacy,
            routing: "Privacy"
        },
        // {
        //     id: "9",
        //     title: "Rate us",
        //     icon: Images.icons.star,
        //     routing: "RateUs"
        // },
        {
            id: "10",
            title: "Login",
            icon: Images.icons.logout,
            routing: "SignIn"
        },
    ],
    ADDRESS_TYPE: [
        {
            id: "1",
            title: "Home",
        },
        {
            id: "2",
            title: "Office",
        },
        {
            id: "3",
            title: "Other",
        },
    ],
    ENTRIES: [
        {
            title: 'Beautiful and dramatic Antelope Canyon',
            subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
            illustration: 'https://i.imgur.com/UYiroysl.jpg'
        },
        {
            title: 'Earlier this morning, NYC',
            subtitle: 'Lorem ipsum dolor sit amet',
            illustration: 'https://i.imgur.com/UPrs1EWl.jpg'
        },
        {
            title: 'White Pocket Sunset',
            subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
            illustration: 'https://i.imgur.com/MABUbpDl.jpg'
        },
        {
            title: 'Acrocorinth, Greece',
            subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
            illustration: 'https://i.imgur.com/KZsmUi2l.jpg'
        },
        {
            title: 'The lone tree, majestic landscape of New Zealand',
            subtitle: 'Lorem ipsum dolor sit amet',
            illustration: 'https://i.imgur.com/2nCt3Sbl.jpg'
        },
        {
            title: 'Middle Earth, Germany',
            subtitle: 'Lorem ipsum dolor sit amet',
            illustration: 'https://i.imgur.com/lceHsT6l.jpg'
        }
    ],
    HOME_CATEGORIES: [
        {
            title: 'Offer',
            image: 'https://n4.sdlcdn.com/imgs/j/l/3/Adbeni-All-In-One-Daily-SDL586844392-1-ad27a.jpg'
        },
        {
            title: 'Mobile',
            image: 'https://s3.india.com/wp-content/uploads/2020/12/inblock.jpg'
        },
        {
            title: 'Fashion',
            image: 'https://media.glamour.com/photos/5f590f9d10f8a1b8a1f2cd39/1:1/w_2500,h_2500,c_limit/maternity%20fashion.jpg'
        },
        {
            title: 'Furniture',
            image: 'https://ii1.pepperfry.com/media/catalog/product/m/o/568x625/modern-chaise-lounger-in-grey-colour-by-dreamzz-furniture-modern-chaise-lounger-in-grey-colour-by-dr-tmnirx.jpg'
        },
        {
            title: 'Shoes',
            image: 'https://images-na.ssl-images-amazon.com/images/I/61utX8kBDlL._UL1100_.jpg'
        },
        {
            title: 'Watches',
            image: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1574443823-best-fitness-trackers-watches-for-women-letscom-1574443794.jpg'
        },
    ],
    NOTIFICATIONS: [
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'Notification 1',
            desc: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
            time: "10 min ago"
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            title: 'Notification 2',
            desc: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
            time: "1 day ago"
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Notification 3',
            desc: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
            time: "20 days ago"
        },
    ],
    LIST_CATEGORIES: [

        {
            id: '1',
            title: 'Shampoos',
            items: '140',
            image: "https://images-na.ssl-images-amazon.com/images/I/81SB5WdsOyL._SL1500_.jpg"
        },
        {
            id: '2',
            title: 'Milk Powder',
            items: "145",
            image: "https://5.imimg.com/data5/JF/HP/MY-57539521/skimmed-milk-powder-500x500.jpg"
        },
        {
            id: '3',
            title: 'Makeup Kit',
            items: "156",
            image: "https://n4.sdlcdn.com/imgs/j/l/3/Adbeni-All-In-One-Daily-SDL586844392-1-ad27a.jpg"
        },
        {
            id: '4',
            title: 'Shampoos',
            items: '140',
            image: "https://images-na.ssl-images-amazon.com/images/I/81SB5WdsOyL._SL1500_.jpg"
        },
        {
            id: '5',
            title: 'Milk Powder',
            items: "145",
            image: "https://5.imimg.com/data5/JF/HP/MY-57539521/skimmed-milk-powder-500x500.jpg"
        },
        {
            id: '6',
            title: 'Makeup Kit',
            items: "156",
            image: "https://n4.sdlcdn.com/imgs/j/l/3/Adbeni-All-In-One-Daily-SDL586844392-1-ad27a.jpg"
        },
    ],
    LIST_PRODUCTS: [
        {
            id: '1',
            title: 'Shampoos',
            rating: '4.5',
            price:'250',
            mrp:'300',
            image: "https://images-na.ssl-images-amazon.com/images/I/81SB5WdsOyL._SL1500_.jpg"
        },
        {
            id: '2',
            title: 'Milk Powder',
            rating: '4',
            price:'300',
            mrp:'400',
            image: "https://5.imimg.com/data5/JF/HP/MY-57539521/skimmed-milk-powder-500x500.jpg"
        },
        {
            id: '3',
            title: 'Makeup Kit',
            rating: '3.5',
            price:'200',
            mrp:'250',
            image: "https://n4.sdlcdn.com/imgs/j/l/3/Adbeni-All-In-One-Daily-SDL586844392-1-ad27a.jpg"
        },
        {
            id: '4',
            title: 'Shampoos',
            rating: '5',
            price:'250',
            mrp:'300',
            image: "https://images-na.ssl-images-amazon.com/images/I/81SB5WdsOyL._SL1500_.jpg"
        },
        {
            id: '5',
            title: 'Milk Powder',
            rating: '4',
            price:'300',
            mrp:'400',
            image: "https://5.imimg.com/data5/JF/HP/MY-57539521/skimmed-milk-powder-500x500.jpg"
        },
        {
            id: '6',
            title: 'Makeup Kit',
            rating: '3.6',
            price:'200',
            mrp:'250',
            image: "https://n4.sdlcdn.com/imgs/j/l/3/Adbeni-All-In-One-Daily-SDL586844392-1-ad27a.jpg"
        },
    ],
    LIST_CART_PRODUCTS: [
        {
            id: '1',
            title: 'Shampoos',
            size: 'M',
            qty:'1',
            price:'300',
            mrp:'250',
            image: "https://images-na.ssl-images-amazon.com/images/I/81SB5WdsOyL._SL1500_.jpg"
        },
        {
            id: '2',
            title: 'Milk Powder',
            size: 'L',
            qty:'5',
            price:'400',
            mrp:'300',
            image: "https://5.imimg.com/data5/JF/HP/MY-57539521/skimmed-milk-powder-500x500.jpg"
        },
        {
            id: '3',
            title: 'Makeup Kit',
            size: 'XL',
            qty:'3',
            price:'250',
            mrp:'350',
            image: "https://n4.sdlcdn.com/imgs/j/l/3/Adbeni-All-In-One-Daily-SDL586844392-1-ad27a.jpg"
        },
    ],
    FEATURED_BRAND: [
        {
            id: '1',
            title: 'Shampoos',
            image: "https://images-na.ssl-images-amazon.com/images/I/81SB5WdsOyL._SL1500_.jpg"
        },
        {
            id: '2',
            title: 'Milk Powder',
            image: "https://5.imimg.com/data5/JF/HP/MY-57539521/skimmed-milk-powder-500x500.jpg"
        },
        {
            id: '3',
            title: 'Makeup Kit',
            image: "https://n4.sdlcdn.com/imgs/j/l/3/Adbeni-All-In-One-Daily-SDL586844392-1-ad27a.jpg"
        },
    ],
    PRODUCT_COLORS: [
        {
            id: '1',
            title: 'red',
            color: 'red'
        },
        {
            id: '2',
            title: 'black',
            color: 'black'
        },
        {
            id: '3',
            title: 'brown',
            color: 'brown'
        },
    ],
    PRODUCT_SIZES: [
        {
            id: '1',
            size: 'S'
        },
        {
            id: '2',
            size: 'M'
        },
        {
            id: '3',
            size: 'L'
        },
        {
            id: '4',
            size: 'XL'
        },
    ],
    SHOP_BY_BRAND: [
        {
            id: "1",
            data: [{
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bo',
                title: 'Nike',
                price: "10.00",
                image: "https://i.pinimg.com/originals/bd/c8/1a/bdc81a948abd4361288cf3a2d709261e.jpg"
            },
            {
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bp',
                title: 'Titan',
                price: "80.00",
                image: "https://zerocreativity0.files.wordpress.com/2016/02/titan-logo-sudarshan-dheer.jpg?w=736"
            },
            {
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                title: 'Adidas',
                price: "9.00",
                image: "https://i.pinimg.com/originals/b6/e2/ef/b6e2ef894ef8e63a8a3e8c35a6e6144a.png"
            },
            {
                id: 'bd7acbea-c1b1-46c2-aed3-3ad53abb28ba',
                title: 'Polo',
                price: "9.00",
                image: "https://i.pinimg.com/originals/e3/a5/19/e3a5199fde5caf756884d99fc60178de.png"
            }]
        },
        {
            id: "2",
            data: [{
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bo',
                title: 'Nike',
                price: "10.00",
                image: "https://i.pinimg.com/originals/bd/c8/1a/bdc81a948abd4361288cf3a2d709261e.jpg"
            },
            {
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bp',
                title: 'Titan',
                price: "80.00",
                image: "https://zerocreativity0.files.wordpress.com/2016/02/titan-logo-sudarshan-dheer.jpg?w=736"
            },
            {
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                title: 'Adidas',
                price: "9.00",
                image: "https://i.pinimg.com/originals/b6/e2/ef/b6e2ef894ef8e63a8a3e8c35a6e6144a.png"
            },
            {
                id: 'bd7acbea-c1b1-46c2-aed3-3ad53abb28ba',
                title: 'Polo',
                price: "9.00",
                image: "https://i.pinimg.com/originals/e3/a5/19/e3a5199fde5caf756884d99fc60178de.png"
            }]
        },
        {
            id: "3",
            data: [{
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bo',
                title: 'Nike',
                price: "10.00",
                image: "https://i.pinimg.com/originals/bd/c8/1a/bdc81a948abd4361288cf3a2d709261e.jpg"
            },
            {
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bp',
                title: 'Titan',
                price: "80.00",
                image: "https://zerocreativity0.files.wordpress.com/2016/02/titan-logo-sudarshan-dheer.jpg?w=736"
            },
            {
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                title: 'Adidas',
                price: "9.00",
                image: "https://i.pinimg.com/originals/b6/e2/ef/b6e2ef894ef8e63a8a3e8c35a6e6144a.png"
            },
            {
                id: 'bd7acbea-c1b1-46c2-aed3-3ad53abb28ba',
                title: 'Polo',
                price: "9.00",
                image: "https://i.pinimg.com/originals/e3/a5/19/e3a5199fde5caf756884d99fc60178de.png"
            }]
        },



    ]
};

export default Constants;