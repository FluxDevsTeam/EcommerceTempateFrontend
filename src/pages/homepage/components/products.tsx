


const Products = () => {
  return (
    <div >
        <div className="hidden md:block ">
             <p className="text-4xl font-medium  flex justify-center ">Latest Items</p>
        </div>

        <div className="block md:hidden flex justify-around items-center">
             <p className="text-3xl font-medium  flex justify-center ">Latest Items</p>
        </div>
    </div>
  )
}

export default Products