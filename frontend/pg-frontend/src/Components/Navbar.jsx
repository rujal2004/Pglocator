import React, { useState } from 'react';
import { FaSearch, FaUser, FaBars, FaHome } from 'react-icons/fa';
import logo from '../assets/logo2.png';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setLogout } from '../redux/state';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleHamburgerClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/properties/search/${search.trim()}`);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <Link to='/' style={styles.link}>
          <FaHome style={styles.logo} />
          <span style={styles.logoText}>PG</span>
          <span style={styles.logoText2}>Finder</span>
        </Link>
      </div>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          style={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <FaSearch
          style={styles.searchIcon}
          onClick={handleSearch}
        />
      </div>

      <div style={styles.landlordText1}>
        {user ? (
          <Link to='/create-listing' style={styles.landlordText}>
            Become A LandLord
          </Link>
        ) : (
          <Link to='/login' style={styles.landlordText}>
            Become A LandLord
          </Link>
        )}
      </div>

      <div style={styles.profileContainer}>
        <FaBars style={styles.hamburgerIcon} onClick={handleHamburgerClick} />

        {user ? (
          <img
            src={`http://localhost:3000/${user.profileImagePath?.replace("public", "")}`}
            style={{ objectFit: "cover", width: "40px", borderRadius: "50%" }}
            alt="profile"
          />
        ) : (
          <FaUser style={styles.profileIcon} />
        )}

        {isDropdownOpen && (
          <div style={styles.dropdownContent}>
            {user ? (
              <>
                <Link style={styles.dropdownItem} to={`/${user._id}/trips`}>
                  Trip List
                </Link>
                <Link style={styles.dropdownItem} to={`/${user._id}/wishList`}>
                  Wish List
                </Link>
                <Link style={styles.dropdownItem} to={`/${user._id}/properties`}>
                  Property List
                </Link>
                <Link style={styles.dropdownItem} to={`/${user._id}/reservations`}>
                  Reservation List
                </Link>
                <Link
                  to="/login"
                  style={styles.dropdownItem}
                  onClick={() => dispatch(setLogout())}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" style={styles.dropdownItem}>
                  Login
                </Link>
                <Link to="/register" style={styles.dropdownItem}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    boxShadow: "rgba(255, 255, 255) 0px 10px 20px, rgba(255, 255, 255) 0px 6px 6px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "baseline",
    gap: "5px"
  },
  logo: {
    cursor: 'pointer',
    color: "white",
    fontSize: "3.2rem"
  },
  logoText: {
    fontSize: "2.4rem",
    color: "#76ABAE",
    fontWeight: "900"
  },
  logoText2: {
    fontSize: "1.8rem",
    color: "#fff"
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#555',
    borderRadius: '5px',
    padding: '5px',
    marginRight: "110px"
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#fff',
    padding: '10px',
    width: '300px',
    borderRadius: '5px',
  },
  searchIcon: {
    color: '#fff',
    marginRight: '10px',
    cursor: 'pointer',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #c5c5c5',
    padding: '0.2rem 0.8rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1.4rem',
    position: 'relative'
  },
  hamburgerIcon: {
    color: '#fff',
    marginRight: '10px',
  },
  profileIcon: {
    color: '#fff',
  },
  dropdownContent: {
    position: 'absolute',
    top: '60px',
    right: '0px',
    backgroundColor: '#333',
    borderRadius: '5px',
    padding: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: '1',
  },
  dropdownItem: {
    display: 'block',
    color: '#fff',
    textDecoration: 'none',
    padding: '5px',
    margin: '5px 0',
    fontSize: '1.2rem',
  },
  landlordText1: {
    position: 'absolute',
    right: '8.5vw',
  },
  landlordText: {
    color: 'white',
    textDecoration: 'none',
  },
  link: {
    textDecoration: 'none',
  }
};

export default Navbar;