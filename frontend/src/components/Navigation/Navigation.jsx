import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const [query, setQuery] = useState('')
  const loc = useLocation()

	return <>
    <div id="topNavBar" className="w500">
      <Link id="topNavBarLogo" to="/">
        <img style={{transform:loc.pathname==='/'?'translate(-8px)':''}} src="/logo/PinteractLogoCircle.png"/>
      </Link>
      <Link className={`topNavBarLink ${loc.pathname==='/'?'selected':''}`} to="/">Home</Link>
      <Link className={`topNavBarLink ${loc.pathname==='/create'?'selected':''}`} to="/create">Create</Link>
      <div id="topNavBarSearch">
        <i className="fas fa-search"/>
        <input
          type="text"
          name="query"
          placeholder="Search"
          value={query}
          onChange={e=>setQuery(e.target.value)}
        />
      </div>
      <ProfileButton/>
    </div>
  </>
}

export default Navigation;
