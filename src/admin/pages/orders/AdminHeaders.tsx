import notis from './img/bell.png';
import search from './img/shape.png';

const AdminHeaders = () => {
  return (
    <div className="flex justify-between">
        <div>
            <h2 className="font-medium text-[28px] mb-2.5">Product Orders</h2>
            <p className="text-base text-[#7C8DB5]">Here is the information about all your orders</p>
        </div>
        <div className="flex items-start gap-4">
            <img src={search} className="w-[24px]" alt="search" />
            <img src={notis} className="w-[24px]" alt="notification" />
        </div>
    </div>
  )
}

export default AdminHeaders
