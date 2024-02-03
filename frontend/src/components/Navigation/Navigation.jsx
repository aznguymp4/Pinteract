import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
	return <>
    <div id="topNavBar">
      <div>Logo</div>
      <div>Home</div>
      <div>Explore</div>
      <div>Create</div>
      <div id="topNavBarSearch">
        <input
          type="text"
          name="search"
          placeholder="Search"
        />
      </div>
      <div>User Icon</div>
    </div>
  </>
  
  // return (
	// 	<ul>
	// 		<li>
	// 			<NavLink to="/">Home</NavLink>
	// 		</li>

	// 		<li>
	// 			<ProfileButton />
	// 		</li>
	// 	</ul>
	// );
}

export default Navigation;
