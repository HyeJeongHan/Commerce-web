export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: (id: number) => `/products/${id}`,
  CART: '/cart',
  ORDERS: '/orders',
  ORDER: (id: number) => `/orders/${id}`,
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const
