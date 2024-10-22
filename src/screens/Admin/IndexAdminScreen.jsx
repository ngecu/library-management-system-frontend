import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { GiBookshelf } from "react-icons/gi";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { FaAnglesUp } from "react-icons/fa6";
import { MdAutorenew } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { BsEmojiAngryFill } from "react-icons/bs";
import { AiOutlineTransaction } from "react-icons/ai";
import { 
  useFetchBooksQuery, 
  useAddBookMutation, 
  useUpdateBookMutation, 
  useDeleteBookMutation 
} from '../../features/booksApi';
import { useFetchPatronsQuery } from '../../features/userApi';
import { Gauge } from '@ant-design/plots';
import client from '../../assets/client.png'
const IndexAdminScreen = () => {

  const location = useLocation();
  const { pathname } = location;
  const { data: books = [], isLoading } = useFetchBooksQuery();
  const { data: patrons = [] } = useFetchPatronsQuery();


  return (
    <div class="container-fluid">

    <div class="row pt-3">
 
        <div class="col-xl-3 col-md-6 mb-4">
          <NavLink to="/librarian/allbooks" style={{textDecoration:"none"}}>
          <div class="card h-100">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Books</div>
                  <div class="h5 mb-0 mr-3 text-white font-weight-bold text-gray-800">{books && books.length}</div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                   
                  </div>
                </div>
                <div class="col-auto">
                <GiBookshelf size={64} color="white" />
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
                    <NavLink to="/librarian/checkin" style={{textDecoration:"none"}}>
                        <div class="card h-100">
                          <div class="card-body">
                            <div class="row no-gutters align-items-center">
                              <div class="col mr-2">
                                <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Check In</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                                <div class="mt-2 mb-0 text-muted text-xs">
                              
                                </div>
                              </div>
                              <div class="col-auto">
                              <MdOutlineKeyboardDoubleArrowDown size={64} color="white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </NavLink>
                    </div>

                    <div class="col-xl-3 col-md-6 mb-4">
                    <NavLink to="/librarian/checkout" style={{textDecoration:"none"}}>
                      <div class="card h-100">
                        <div class="card-body">
                          <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                              <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Check Out</div>
                              <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                              <div class="mt-2 mb-0 text-muted text-xs">
                             
                              </div>
                            </div>
                            <div class="col-auto">
                            <FaAnglesUp size={64} color="white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      </NavLink>
                    </div>

                    <div class="col-xl-3 col-md-6 mb-4">
                    <NavLink to="/librarian/patrons" style={{textDecoration:"none"}}>

          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Patrons</div>
                  <div class="h5 text-white mb-0 font-weight-bold text-gray-800">{patrons && patrons.length}</div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
                <FaUsers size={64} color="white"  />
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>

                   

      <div className="col-xl-6 col-md-6 mb-4">
      <div className="row h-100">
       

       <div class="col-xl-6 col-md-6 mb-4 h-100">
         <div class="card h-100">
           <div class="card-body">
             <div class="row align-items-center">
               <div class="col mr-2">
                 <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                 <div class="mt-2 mb-0 text-muted text-xs">
                 
                 </div>
               </div>
               <div class="col-auto">
              <img src={client} style={{width:"100%"}} alt="" />
                
               </div>
             </div>
           </div>
         </div>
       </div>
       <div class="col-xl-6 col-md-6 mb-4 h-100">
         <div class="card h-100">
           <div class="card-body">
             <div class="row align-items-center">
               <div class="col mr-2">
                 <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                 <div class="mt-2 mb-0 text-muted text-xs">
                 
                 </div>
               </div>
               <div class="col-auto">
              <img src={client} style={{width:"100%"}} alt="" />
                
               </div>
             </div>
           </div>
         </div>
       </div>
       </div>
      </div>
      <div className="col-xl-6 col-md-6 mb-4">
        <div className="row">
       

   

        <div class="col-xl-6 col-md-6 mb-4">
        <NavLink to="/librarian/overdue" style={{textDecoration:"none"}}>
          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Overdue</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
          
                <BsEmojiAngryFill size={64} color="red" />
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>

        <div class="col-xl-6 col-md-6 mb-4">
        <NavLink to="/librarian/transactions" style={{textDecoration:"none"}}>
          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Trans.</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
                <AiOutlineTransaction size={64} color="white" />
                
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>

        <div class="col-xl-6 col-md-6 mb-4">
        <NavLink to="/librarian/reports" style={{textDecoration:"none"}}>
          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Reports</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
                <HiDocumentReport size={64} color="white" />
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>

    

        <div class="col-xl-6 col-md-6 mb-4">
        <NavLink to="/librarian/reports" style={{textDecoration:"none"}}>
          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Add User</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
                <FaUserPlus size={64} color="white" />
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>
        </div>
      </div>

        

    </div>

    
 
    </div>
  );
};

export default IndexAdminScreen;





const DemoGauge = () => {
  const config = {

    autoFit: true,
    data: {
      target: 159,
      total: 400,
      name: 'score',
      thresholds: [100, 200, 400],
    },
    legend: false,
    scale: {
      color: {
        range: ['#F4664A', '#FAAD14', 'green'],
      },
    },
    style: {
      textContent: (target, total) => `得分：${target}\n占比：${(target / total) * 100}%`,
    },
  };
  return <Gauge {...config} />;
};
