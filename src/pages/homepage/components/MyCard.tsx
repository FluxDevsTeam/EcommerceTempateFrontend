import Card from "@/card/Card"

const MyCard = ({product}) => {
  // Check if product is an array and has items
  if (!product || product.length === 0) {
    return <div>No products available</div>;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {product.map((item) => (
        <Card key={item.id} product={item} />
      ))}
    </div>
  )
}

export default MyCard