

import ShoeCategoryList from "./ShoeCategoryList"


const ShoeCategory = () => {
  return (
    <div className="w-full min-h-full flex flex-col my-6 pt-6 md:px-24 px-0">
   <p className="text-3xl md:text-4xl font-medium  flex justify-center ">Shoes</p>
            <ShoeCategoryList/>
    </div>
  )
}

export default ShoeCategory