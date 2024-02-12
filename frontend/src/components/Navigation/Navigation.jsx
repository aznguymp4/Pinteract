import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../../redux/search";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch()
  const search = useSelector(s=>s.search)
  const loc = useLocation()

	return <>
    <div id="topNavBar" className="w500">
      <Link id="topNavBarLogo" to="/">
        <img style={{transform:loc.pathname==='/'?'translate(-8px)':''}} src="/logo/PinteractLogoCircle.png"/>
      </Link>
      <Link className={`topNavBarLink ${loc.pathname==='/'?'selected':''}`} to="/">Home</Link>
      <Link className={`topNavBarLink ${loc.pathname==='/create'?'selected':''}`} to="/create">Create</Link>
      {search.enabled? <div id="topNavBarSearch">
        <i className="fas fa-search"/>
        <input
          id="searchIpt"
          type="text"
          name="query"
          placeholder={search.placeholder || 'Search'}
          value={search.query}
          onChange={e=>dispatch(setQuery(e.target.value))}
          disabled={!search.enabled}
        />
      </div> : <div style={{flexGrow:1}}/>}
      <ProfileButton/>
    </div>
  </>
}

export default Navigation;
