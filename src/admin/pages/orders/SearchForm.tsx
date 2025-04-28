import search from './img/shape.png';

const SearchForm = () => {
  return (
    <form className="flex items-center gap-4 px-2 py-1 sm:px-4 sm:py-2.5 border border-[#CACACA] rounded-lg">
        <img src={search} alt="search" className="h-[18px] w-[18px]" />
        <input type="text" placeholder="Search" className="focus:outline-none" />
    </form>
  )
}

export default SearchForm
