import React, { useRef, useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { apiUrl } from "../../../server.json";
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import "./billrecords.css";
import { useReactToPrint } from 'react-to-print';

const Modal = ({ closeModal }) => (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={closeModal}><p id="closetimeicon">&times;</p></span>
      <p>
        If you click "Print" and the watermark doesn't appear, please cancel and click print again.
        Finally, check to ensure that the watermark is showing in your document.
      </p>
    </div>
  </div>
);

const Billrecords = () => {
  const { user } = useContext(AuthContext);
  const [billrecords, setBillrecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const itemsPerPage = 5;
  const componentRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Transaction history',
  });

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchBillrecord = async () => {
      try {
        const response = await axios.get(`${apiUrl}/billrecords`);
        const filteredRecords = user ? response.data.data.filter((record) => record.email === user.email) : [];
        setBillrecord(filteredRecords);
      } catch (error) {
        console.error('Error fetching billrecords:', error);
      }
    };

    fetchBillrecord();
  }, [user]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredItems = billrecords.filter(record =>
    record.typebill.toLowerCase().includes(searchInput.toLowerCase()) ||
    record.typebillamount.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
    record.fromdate.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
    record.todate.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
    record.yrtype.toString().toLowerCase().includes(searchInput.toLowerCase())
  );
  const currentItems = searchInput ? filteredItems.slice(indexOfFirstItem, indexOfLastItem) : billrecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const btnpagefunct = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {user ? (
        <CCard className="mb-4">
          <CCardHeader>
            B.R <button className='printbtn' onClick={handlePrint}>Print</button>
            <button className='readme' onClick={openModal}>READ ME</button>
          </CCardHeader>
          <CCardBody>
          <div className="search-bar">
              <input
              className='inputsearchbar'
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            {currentItems.length > 0 ? (
              <>
                <p id="printre">Please print the document with a watermark. If your document does not have a watermark, it will not be considered valid.</p>
                <table ref={componentRef} className="table">
                  <thead>
                    <tr>
                      <th id="titlebill">BILL:</th>
                      <th id="titlebill">AMOUNT</th>
                      <th id="titlebill">FROM</th>
                      <th id="titlebill">TO</th>
                      <th id="titlebill">YEAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((record, index) => (
                      <tr key={index}>
                        <td id="tbodyonlinepay">
                          <p><h className="yrr">{record.typebill}</h></p>
                        </td>
                        <td id="tbodyonlinepay">
                          <p><code className="text-success">₱{record.typebillamount}</code></p>
                        </td>
                        <td id="tbodyonlinepay">
                          <p><code className="fromto23">{record.fromdate}</code></p>
                        </td>
                        <td id="tbodyonlinepay">
                          <p><code className="fromto23">{record.todate}</code></p>
                        </td>
                        <td id="tbodyonlinepay">
                          <p><h className="yrr">{record.yrtype}</h></p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagebtnslice">
                  <button className='btnnextpage' onClick={() => btnpagefunct(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                  <span className='totalpagescount'>{currentPage}/{totalPages}</span>
                  <button className='btnprevious' onClick={() => btnpagefunct(currentPage + 1)} disabled={indexOfLastItem >= filteredItems.length}>Next</button>
                </div>
              </>
            ) : (
              <div className="text-center mt-3">Search not found.</div>
            )}
          </CCardBody>
        </CCard>
      ) : (
        <div className="text-center mt-3">You are not logged in.</div>
      )}
      {showModal && <Modal closeModal={closeModal} />}
    </>
  );
};

export default Billrecords;