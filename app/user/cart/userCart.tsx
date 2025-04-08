// // store/cartStore.ts
// import {create} from 'zustand';

// interface CartItem {
//   courseId: number;
//   title: string;
//   instructor: string;
//   price: number;
//   discountedPrice: number;
//   discountAmount: number;
//   discountRate: number;
//   image: string;
// }

// interface CartStore {
//   cartItems: CartItem[];
//   selectedItems: number[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (courseId: number) => void;
//   selectItem: (courseId: number) => void;
//   deselectItem: (courseId: number) => void;
// }

// export const userCart = create<CartStore>((set) => ({
//   cartItems: [],
//   selectedItems: [],
//   addToCart: (item) => set((state) => ({ cartItems: [...state.cartItems, item] })),
//   removeFromCart: (courseId) => set((state) => ({
//     cartItems: state.cartItems.filter(item => item.courseId !== courseId),
//   })),
//   selectItem: (courseId) => set((state) => ({
//     // 이미 선택된 항목이 없으면 추가하고, 있으면 그대로 두기
//     selectedItems: state.selectedItems.includes(courseId)
//       ? state.selectedItems
//       : [...state.selectedItems, courseId],
//   })),
//   deselectItem: (courseId) => set((state) => ({
//     // 선택된 항목에서 courseId를 제외
//     selectedItems: state.selectedItems.filter(id => id !== courseId),
//   })),
// }));