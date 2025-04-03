import { CiCircleCheck } from "react-icons/ci";

const DescriptionList = () => {
  return (
    <div className="w-full max-w-lg">
      <ul className="space-y-2 sm:space-y-3">
        {[
          "Material: 100% cotton",
          "Fit: Designed with style",
          "Design: Basic Colors available",
          "Color: Red, Blue, Black, White",
          "Sizes: Small, Medium, Large"
        ].map((item, index) => (
          <li key={index} className="flex items-start sm:items-center gap-2 sm:gap-3">
            <span className="mt-0.5 sm:mt-0">
              <CiCircleCheck className="text-green-500 text-lg sm:text-xl" />
            </span>
            <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DescriptionList;