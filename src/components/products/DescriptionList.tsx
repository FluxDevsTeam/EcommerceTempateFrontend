import { CiCircleCheck } from "react-icons/ci";

interface DescriptionListProps {
  details: {
    [key: string]: string;
  };
}

const DescriptionList = ({ details }: DescriptionListProps) => {
  return (
    <div className="w-full max-w-lg">
      <ul className="space-y-2 sm:space-y-3">
        {Object.entries(details).map(([key, value]) => (
          <li key={key} className="flex items-start sm:items-center gap-2 sm:gap-3">
            <span className="mt-0.5 sm:mt-0">
              <CiCircleCheck className="text-green-500 text-lg sm:text-xl" />
            </span>
            <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
              <span className="font-medium">{key}:</span> {value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DescriptionList;