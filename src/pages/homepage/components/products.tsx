
import  SortDropdown  from "@/components/SortDropdown"



const Products = () => {
  return (
    <div >
        <div className="hidden md:block">
             <SortDropdown/>
             <p className="text-5xl font-medium  flex justify-center ">Latest Items</p>
        </div>

        <div className="block md:hidden flex justify-around items-center">
             <SortDropdown/>
             <p className="text-3xl font-medium  flex justify-center ">Latest Items</p>
        </div>
    </div>
  )
}

export default Products