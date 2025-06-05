import { googleLogout } from '@react-oauth/google';

const GoogleLogoutButton = () => {
    const handleLogout = () => {
        googleLogout();
        console.log("Logout Success");
    };

    return (
        <div id="signOutButton">
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default GoogleLogoutButton;
