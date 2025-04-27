import search from './img/shape.png';

const SearchForm = () => {
  return (
    <form className="flex items-center gap-4 px-4 py-2.5 border border-[#CACACA] rounded-lg mr-auto">
        <img src={search} alt="search" className="h-[18px] w-[18px]" />
        <input type="text" placeholder="Search" className="focus:outline-none" />
    </form>
  )
}

export default SearchForm
