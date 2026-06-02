import { Product } from '@/domain/entities/product.entity'

// 카테고리별 Unsplash 이미지 풀 (상품 ID로 분산 선택 → 같은 상품은 항상 같은 이미지)
const CATEGORY_PHOTOS: Record<string, string[]> = {
  '전자기기': [
    'photo-1498049794561-7780e7231661', // colorful electronics
    'photo-1526738549149-8e07eca6c147', // headphones on colors
    'photo-1511707171634-5f897ff02aa9', // smartphone
    'photo-1496181133206-80ce9b88a853', // macbook
    'photo-1525547719571-a2d4ac8945e2', // laptop closeup
    'photo-1601784551446-20c9e07cdbdb', // modern phone
  ],
  '패션/의류': [
    'photo-1558618666-fcd25c85cd64', // fashion collection
    'photo-1515886657613-9f3515b0c78f', // model fashion
    'photo-1523381210434-271e8be1f52b', // clothing rack
    'photo-1556905055-8f358a7a47b2', // street fashion
    'photo-1542291026-7eec264c27ff', // red sneakers
    'photo-1564584217132-2271feaeb3c5', // jacket
  ],
  '식품/음료': [
    'photo-1490818387583-1baba5e638af', // food spread
    'photo-1512621776951-a57141f2eefd', // salad bowl
    'photo-1504674900247-0877df9cc836', // food overhead
    'photo-1565958011703-44f9829ba187', // colorful food
    'photo-1482049016688-2d3e1b311543', // breakfast
    'photo-1498837167922-ddd27525d352', // healthy food
  ],
  '생활용품': [
    'photo-1556909114-f6e7ad7d3136', // kitchen items
    'photo-1484101403633-562f891dc89a', // interior design
    'photo-1583947215259-38e31be8751f', // home decor
    'photo-1513506003901-1e6a35498702', // living room
    'photo-1585771724684-38269d6639fd', // cleaning products
    'photo-1540518614846-7eded433c457', // bedroom
  ],
  '스포츠/레저': [
    'photo-1517649763962-0c623066013b', // sports action
    'photo-1571019613454-1cb2f99b2d8b', // workout gym
    'photo-1461896836934-ffe607ba8211', // outdoor sports
    'photo-1576678927484-cc907957088c', // gym equipment
    'photo-1544216428-1f5be97bc86e', // running shoes
    'photo-1534438327276-14e5300c3a48', // fitness
  ],
}

const FALLBACK_PHOTOS = [
  'photo-1441986300917-64674bd600d8', // shopping bag
  'photo-1607082348824-0a96f2a4b9da', // shopping
  'photo-1472851294608-062f824d29cc', // store
]

/**
 * 상품의 이미지 URL을 반환합니다.
 * - 백엔드에서 imageUrl이 내려오면 그대로 사용
 * - 없으면 카테고리 + 상품 ID 기반으로 Unsplash 이미지를 결정론적으로 선택
 */
export function getProductImageUrl(product: Product): string {
  if (product.imageUrl) return product.imageUrl

  const categoryName = product.categoryName ?? product.category?.name ?? ''
  const photos = CATEGORY_PHOTOS[categoryName] ?? FALLBACK_PHOTOS
  const photo = photos[product.id % photos.length]

  return `https://images.unsplash.com/${photo}?w=600&q=80`
}
