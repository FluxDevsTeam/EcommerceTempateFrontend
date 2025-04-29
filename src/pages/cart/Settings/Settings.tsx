import { Link } from "react-router-dom";

import PersonalInfo from "./settings component/Personal-Info";
import ChangeEmail from "./settings component/Change-Email";
import PasswordChange from "./settings component/Password-Change";

const GeneralSettings = () => {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-6 font-poppins">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span>Settings</span>
      </div>

      <div>
        <PersonalInfo></PersonalInfo>
        <ChangeEmail></ChangeEmail>
        <PasswordChange></PasswordChange>
      </div>
    </div>
  );
};

export default GeneralSettings;
