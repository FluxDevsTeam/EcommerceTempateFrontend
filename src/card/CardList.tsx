import React, { useState, useEffect } from 'react';
import Wish from './Wish';
import { deleteWishItem, addWishItem } from './api';

interface Product {
  id: number;
  name: string;
  image1: string;
  price: string;
  discounted_price: string;
}

interface CardItem {
  id: number; // wishlist ID
  product: Product;
}

interface CardListProps {
  endpoint: string;
}

// Utility to check if user is authenticated
const isAuthenticated = () => {
  return !!sessionStorage.getItem('jwt_token');
};

const CardList: React.FC<CardListProps> = ({ endpoint }) => {
  const [wishlist, setWishlist] = useState<CardItem[]>([]);
  const [likedProductIds, setLikedProductIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAuthenticated()) {
          const response = await fetch(endpoint, {
            headers: {
              Authorization: `JWT ${sessionStorage.getItem('jwt_token')}`,
            },
          });
          const jsonData: CardItem[] = await response.json();
          setWishlist(jsonData);
          setLikedProductIds(new Set(jsonData.map(item => item.product.id)));
        } else {
          const stored = sessionStorage.getItem('guestWishlist');
          const guestIds = stored ? JSON.parse(stored) : [];
          setLikedProductIds(new Set(guestIds));
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  const handleToggleLike = async (product: Product, wishlistId: number | null) => {
    const isLiked = likedProductIds.has(product.id);

    if (isAuthenticated()) {
      if (isLiked && wishlistId !== null) {
        try {
          await deleteWishItem(wishlistId);
          setWishlist(prev => prev.filter(item => item.product.id !== product.id));
          setLikedProductIds(prev => {
            const updated = new Set(prev);
            updated.delete(product.id);
            return updated;
          });
        } catch (error) {
          console.error("Failed to delete wishlist item:", error);
        }
      } else {
        try {
          const newItem = await addWishItem(product.id);
          setWishlist(prev => [...prev, newItem]);
          setLikedProductIds(prev => new Set(prev).add(product.id));
        } catch (error) {
          console.error("Failed to add wishlist item:", error);
        }
      }
    } else {
      // Guest logic
      const updated = new Set(likedProductIds);
      if (isLiked) {
        updated.delete(product.id);
      } else {
        updated.add(product.id);
      }
      setLikedProductIds(updated);
      sessionStorage.setItem('guestWishlist', JSON.stringify([...updated]));
    }
  };

  if (loading) return <p className="p-10 text-center">Loading ...</p>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16">
      {wishlist.map((item) => {
        const isLiked = likedProductIds.has(item.product.id);

        return (
          <div key={item.product.id} className="mb-10">
            <div className="relative w-fit mb-4">
              <img
                src={item.product.image1}
                alt={item.product.name}
                className="rounded-2xl h-[180px] lg:h-[300px]"
              />
              <Wish
                color="red"
                liked={isLiked}
                onToggle={() => handleToggleLike(item.product, item.id)}
              />
            </div>
            <p className="text-base sm:text-[20px] mb-2">{item.product.name}</p>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-[14px] sm:text-[24px]">₦{item.product.price}</span>
              <span className="text-[10px] sm:text-[24px] text-[#00000066] line-through">
                ₦{item.product.discounted_price}
              </span>
              <span className="text-[#FF3333] bg-red-200 text-[10px] sm:text-[12px] flex justify-between items-center rounded-3xl py-0.5 px-1 sm:px-3">
                -{Math.round(
                  ((parseFloat(item.product.discounted_price) - parseFloat(item.product.price)) /
                    parseFloat(item.product.discounted_price)) *
                    100
                )}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardList;







// import React, { useState, useEffect } from 'react';
// import Wish from './Wish';
// import { deleteWishItem, addWishItem } from './api';

// interface Product {
//   id: number;
//   name: string;
//   image1: string;
//   price: string;
//   discounted_price: string;
// }

// interface CardItem {
//   id: number; // wishlist ID
//   product: Product;
// }

// interface CardListProps {
//   endpoint: string;
// }

// const CardList: React.FC<CardListProps> = ({ endpoint }) => {
//   const [wishlist, setWishlist] = useState<CardItem[]>([]);
//   const [likedProductIds, setLikedProductIds] = useState<Set<number>>(new Set());
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(endpoint);
//         const jsonData: CardItem[] = await response.json();
//         setWishlist(jsonData);
//         setLikedProductIds(new Set(jsonData.map(item => item.product.id)));
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [endpoint]);

//   const handleToggleLike = async (product: Product, wishlistId: number | null) => {
//     const isLiked = likedProductIds.has(product.id);

//     if (isLiked && wishlistId !== null) {
//       // Unlike: remove from wishlist
//       try {
//         await deleteWishItem(wishlistId);
//         setWishlist(prev => prev.filter(item => item.product.id !== product.id));
//         setLikedProductIds(prev => {
//           const updated = new Set(prev);
//           updated.delete(product.id);
//           return updated;
//         });
//       } catch (error) {
//         console.error("Failed to delete wishlist item:", error);
//       }
//     } else {
//       // Like: add to wishlist
//       try {
//         const newItem = await addWishItem(product.id);
//         setWishlist(prev => [...prev, newItem]);
//         setLikedProductIds(prev => new Set(prev).add(product.id));
//       } catch (error) {
//         console.error("Failed to add wishlist item:", error);
//       }
//     }
//   };

//   if (loading) return <p className="p-10 text-center">Loading ...</p>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16">
//       {wishlist.map((item) => {
//         const isLiked = likedProductIds.has(item.product.id);

//         return (
//           <div key={item.product.id} className="mb-10">
//             <div className="relative w-fit mb-4">
//               <img
//                 src={item.product.image1}
//                 alt={item.product.name}
//                 className="rounded-2xl h-[180px] lg:h-[300px]"
//               />
//               <Wish
//                 color="red"
//                 liked={isLiked}
//                 onToggle={() => handleToggleLike(item.product, item.id)}
//               />
//             </div>
//             <p className="text-base sm:text-[20px] mb-2">{item.product.name}</p>
//             <div className="flex items-center gap-2 sm:gap-4">
//               <span className="text-[14px] sm:text-[24px]">₦{item.product.price}</span>
//               <span className="text-[10px] sm:text-[24px] text-[#00000066] line-through">
//                 ₦{item.product.discounted_price}
//               </span>
//               <span className="text-[#FF3333] bg-red-200 text-[10px] sm:text-[12px] flex justify-between items-center rounded-3xl py-0.5 px-1 sm:px-3">
//                 -{Math.round(
//                   ((parseFloat(item.product.discounted_price) - parseFloat(item.product.price)) /
//                     parseFloat(item.product.discounted_price)) *
//                     100
//                 )}%
//               </span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default CardList;
