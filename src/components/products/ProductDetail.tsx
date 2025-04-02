
import Suggested from "./Suggested"



const ProductDetail = () => {
  return (
    <div className='w-full min-h-full px-24 my-8'>
      <div className=' flex justify-center items-center '>
        <div className="flex space-x-4">
          <div className="flex flex-col space-y-6">
         <div className=' bg-gray-200 p-2 border-none rounded-lg'><img src="https://picsum.photos/400/300" alt="image1" className="w-[90px] h-[90px]"/> </div>
         <div className=' bg-gray-200 p-2 border-none rounded-lg'><img src="https://picsum.photos/200/540" alt="image1" className="w-[90px] h-[90px]"/> </div> 
         <div className='bg-gray-200 p-2 border-none rounded-lg'><img src="https://picsum.photos/435/324" alt="image1" className="w-[90px] h-[90px]"/> </div> 
          </div>
          <div className=' bg-gray-200 p-6 border-none rounded-lg'><img src="https://picsum.photos/435/324" alt="image1" className="w-[350px] h-[320px]"/> </div> 
          <div>
            <div className="px-6 space-y-4 ">
              <p className="font-medium text-[40px] leading-[100%] ">One Life Graphic T-Shirt</p>
              <p className="bg-[#72D3E9] text-3 border-none rounded-2xl p-1 w-[176px] px-2">5 left in stock</p>
              <div className="mt-2 flex items-center">
              <span className="text-xl font-bold">$500</span>
              <span className="ml-2 text-gray-500 line-through text-lg">$200</span>
              <span className="ml-2 bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm">10</span>
            </div>
            <p className="text-[#000000] text-4 leading-[22px] font-medium">This shirt is made of synthetic fiber whch  can last for tears,available  offers start right here</p>
            <div className="flex flex-col">
              <p className="text-[#000000] text-4">color</p>
              <p className="text-[#000000] text-4 font-bold">Teal</p>

            </div>
            <div className="space-y-5">
              <div className="flex space-x-6">
              <button className="p-3 bg-gray-200 text-black border-none border-black  ">-</button>
              <p className="text-5 py-2">1</p>
              <button className=" p-3 bg-gray-200 text-black border-none border-black">+</button>
              </div>
              <div className="flex space-x-3">
              <button className="p-3 bg-gray-200 text-black border rounded-2xl border-black  w-[121px]">Small</button>
              <button className="p-3 bg-gray-200 text-black border rounded-2xl border-black  w-[121px]">Medium</button>
              <button className="p-3 bg-black text-white border rounded-2xl border-black  w-[121px]">Large</button>
              <button className="p-3 bg-gray-200 text-black border rounded-2xl border-black  w-[121px]">Extra Large</button>

              </div>
            <button className="p-3 bg-black text-white border rounded-2xl border-black  w-[80%]">Add to Cart</button>
            </div>
            </div>
          </div>
         
        </div>

       
        <div></div>
      </div>

      <div className="mt-8 space-y-4">
            <p className="text-4">Description</p>
            <p className='text-5 text-[#000000]'>This is a vintage product produced by versacunder thier label,Medussa ,it offers an autentic blend of modern and antique</p>
            <Suggested/>
          </div>
    </div>
  )
}

export default ProductDetail