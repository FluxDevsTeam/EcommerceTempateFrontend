import shirt from './img/shirt.png'
import Wish from "./Wish"

const Wishlist = () => {
  const wishlistItems = Array.from({ length: 8 }, (_, index) => ({
    id: index,
    name: "Polo with Contrast Trims",
    price: 212,
    oldPrice: 242,
    discount: "-20%",
    image: shirt
  }));

  return (
    <div className='p-4 sm:p-14'>
      <h2 className="font-normal text-[32px] sm:text-[40px] tracking mb-8">Wishlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 sm:mb-16">
        {wishlistItems.map((item) => (
          <div key={item.id} className='mb-10'>
            <div className="relative w-fit mb-4">
              <img src={item.image} alt={item.name} className="rounded-3xl" />
              <Wish color="red" defaultLiked />
            </div>
            <p className="text-base sm:text-[20px] mb-2">{item.name}</p>
            <div className="flex gap-2 sm:gap-4">
              <span className="text-[20px] sm:text-[24px]">${item.price}</span>
              <span className="text-[20px] sm:text-[24px] text-[#00000066] line-through">${item.oldPrice}</span>
              <span className="text-[#FF3333] bg-red-200 text-[10px] sm:text-[12px] flex justify-between items-center rounded-3xl py-0.5 px-3">
                {item.discount}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div>
          <div className="relative w-fit">
            <img src={shirt} className="rounded-3xl" />
            <Wish />
          </div>
          <p className="text-[20px]">Polo with Contrast Trims</p>
          <div className="flex gap-4">
            <span className="text-[24px]">$212</span>
            <span className="text-[24px] text-[#00000066] line-through">$242</span>
            <span className="text-[#FF3333] bg-red-200 text-[12px] flex justify-between items-center rounded-3xl py-0.5 px-3">-20%</span>
          </div>
        </div>
    </div>
  );
};

export default Wishlist;
