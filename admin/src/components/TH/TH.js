import React, { useRef, useState } from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import "./th.css";
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

const TH = () => {
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

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          T.H
          <button className='printbtn' onClick={handlePrint}>Print</button>
          <button className='readme' onClick={openModal}>READ ME</button>
        </CCardHeader>
        <CCardBody>
          <p id="printre">Please print the document with a watermark. If your document does not have a watermark, it will not be considered valid.</p>
          <table ref={componentRef} className="table">
            <thead>
              <tr>
                <th id="titlebill2">PAYMENT METHODS</th>
                <th id="titlebill2">BILL PAID</th>
                <th id="titlebill2">AMOUNT</th>
                <th id="titlebill2">DATE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="tbodyonlinepay">
                  <p>
                    <code id="text-succ" className="text-success">Gcash</code>
                  </p>
                </td>
                <td id="tbodyonlinepay">
                  <p>
                    <code className="highlighter-rouge">Water&Electric</code>
                  </p>
                </td>
                <td id="tbodyonlinepay">
                  <p>
                    <code className="highlighter-rouge">₱2,895</code>
                  </p>
                </td>
                <td id="tbodyonlinepay">
                  <span className="datesize">August 23, 2024</span>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      {showModal && <Modal closeModal={closeModal} />}
    </>
  );
};

export default TH;