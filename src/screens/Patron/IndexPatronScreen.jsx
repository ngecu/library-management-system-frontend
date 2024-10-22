import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { GiBookshelf } from "react-icons/gi";
import { BsEmojiAngryFill } from "react-icons/bs";
import { AiOutlineTransaction } from "react-icons/ai";
import { HiDocumentReport } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import { useFetchBooksQuery } from '../../features/booksApi';
import { useFetchPatronsQuery } from '../../features/userApi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const IndexPatronScreen = () => {


  const location = useLocation();
  const { pathname } = location;
  const { data: books = [], isLoading: isBooksLoading } = useFetchBooksQuery();
  const { data: patrons = [], isLoading: isPatronsLoading } = useFetchPatronsQuery();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  const formatTime = (time) => {
    return time.toLocaleTimeString();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };
  return (
    <div className="container">
      <div className="row pt-3">
      <div className="col-xl-6 col-md-6 mb-4">
 {/* Books Section */}
 <div className="row">

 <div className="col-xl-12 col-md-12 mb-4">
 {formatDate(currentTime)} {formatTime(currentTime)}
  </div>

 <div className="col-xl-6 col-md-12 mb-4">
          <NavLink to="/patron/allbooks" style={{ textDecoration: "none" }}>
            <div className="card h-100">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs text-white font-weight-bold text-uppercase mb-1">Books</div>
                    <div className="h5 mb-0 mr-3 text-white font-weight-bold text-gray-800">{books && books.length}</div>
                  </div>
                  <div className="col-auto">
                    <GiBookshelf size={64} color="white" />
                  </div>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Overdue Section */}
        <div className="col-xl-6 col-md-12 mb-4">
          <NavLink to="/patron/overdue" style={{ textDecoration: "none" }}>
            <div className="card h-100">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs text-white font-weight-bold text-uppercase mb-1">Overdue</div>
                  </div>
                  <div className="col-auto">
                    <BsEmojiAngryFill size={64} color="red" />
                  </div>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

    

        {/* Transactions Section */}
        <div className="col-xl-12 col-md-12 mb-4">

              <NavLink to="/patron/transactions" style={{ textDecoration: "none" }}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs text-white font-weight-bold text-uppercase mb-1">Transactions</div>
                      </div>
                      <div className="col-auto">
                        <AiOutlineTransaction size={64} color="white" />
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>

        </div>
        </div>
        </div>
        <div className="col-xl-6 col-md-6 mb-4">
        <Calendar  />
          </div>

       
      </div>
    </div>
  );
};

export default IndexPatronScreen;
