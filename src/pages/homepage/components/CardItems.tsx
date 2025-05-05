
import CardList from "@/card/CardList"

const CardItems = ({ data }) => {
  return (
    <div>
         <h2 className="text-xl font-semibold mb-6">Products</h2>
        <CardList endpoint={data} />
    </div>
  )
}

export default CardItems