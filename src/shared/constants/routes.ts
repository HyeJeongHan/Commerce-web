export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: (id: number) => `/products/${id}`,
  CART: '/cart',
  WISHLIST: '/wishlist',
  ORDERS: '/orders',
  ORDER: (id: number) => `/orders/${id}`,
  ACCOUNT: '/account',
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const
