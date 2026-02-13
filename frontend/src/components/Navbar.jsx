import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="mb-5">
            <Link to="/" className="mr-4 text-blue-600 hover:underline">Home</Link>
            <Link to="/status" className="mr-4 text-blue-600 hover:underline">System Status</Link>
        </div>
    );
};

export default Navbar;
