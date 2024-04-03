import axios from "axios";
import { useContext, useState, useEffect } from "react";
import "./dashboard.css";
import classNames from "classnames";
import { apiUrl } from "../../../server.json";
import logocainta from "./favicon.ico";
import { AuthContext } from "../../context/AuthContext";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cifPh,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilPencil,
  cilTrash,
} from "@coreui/icons";

import WidgetsBrand from "../widgets/WidgetsBrand";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import MainChart from "./MainChart";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    const userToEdit = users.find((user) => user._id === userId);
    setEditedUser(userToEdit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditedUser(null);
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/users/update/${editedUser._id}`,
        editedUser,
      );
      console.log("User updated:", response.data);
      const updatedUsers = users.map((user) =>
        user._id === editedUser._id ? response.data : user,
      );
      setUsers(updatedUsers);
      setShowModal(false);
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.prompt('Type "DELETE" to confirm delete:');
    if (confirmDelete === "DELETE") {
      try {
        setIsLoading(true);
        await axios.delete(`${apiUrl}/users/${userId}`);
        console.log("User deleted:", userId);
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Confirmation failed. User not deleted.");
    }
  };

  return (
    <>
      <WidgetsDropdown className="mb-4" />

      <CCard className="mb-4">
        {user ? (
          <CCardBody>
            <CRow>
              <CCol sm={5}>
                <h4 id="traffic" className="card-title mb-0">
                  Chart <CIcon icon={cifPh} />
                </h4>
                <div className="small text-body-secondary">
                  January - December 2024
                </div>
              </CCol>
              <CCol sm={7} className="d-none d-md-block">
                <CButtonGroup className="float-end me-3">
                  {["Day", "Month", "Year"].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      active={value === "Month"}
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
              </CCol>
            </CRow>
            /* *\
          </CCardBody>
        ) : (
          <div className="text-center mt-3"></div>
        )}
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          ></CRow>
        </CCardFooter>
      </CCard>

      <WidgetsBrand className="mb-4" withCharts />
      <CRow>
        <CCol xs>
          {user ? (
            <CCard className="mb-4">
              <CCardHeader>
                <img src={logocainta} alt="Logo" height={25} />{" "}
              </CCardHeader>
              <CCardBody>
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        <CIcon icon={cilPeople} />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Name
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Contact#
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Email
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Gender
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Birthdate
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {users.map((user) => (
                      <CTableRow key={user._id}>
                        <CTableDataCell className="text-center">
                          <CAvatar size="md" src={user.img} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            {user.username}&nbsp;{user.surname}
                          </div>
                          <div className="small text-body-secondary text-nowrap">
                            {user.stall}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {user.phone}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex justify-content-between text-nowrap">
                            <div className="fw-semibold">{user.email}</div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {user.sex}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold text-nowrap">
                            {user.birthdate}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex justify-content-between align-items-center">
                            <CIcon
                              icon={cilPencil}
                              className="text-primary"
                              id="iconaction"
                              onClick={() => handleEdit(user._id)}
                            />
                            <CIcon
                              icon={cilTrash}
                              className="text-danger"
                              id="iconaction"
                              onClick={() => handleDelete(user._id)}
                            />
                          </div>
                        </CTableDataCell>
                        <Modal show={showModal} onHide={handleCloseModal}>
                          <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form className="Formlisttt">
                              <Form.Group controlId="formUsername">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter firstname"
                                  value={editedUser ? editedUser.username : ""}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      username: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                className="lastnametitle"
                                controlId="formLastname"
                              >
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter lastname"
                                  value={editedUser ? editedUser.surname : ""}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      surname: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                className="emailtitle"
                                controlId="formEmail"
                              >
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="Enter email"
                                  value={editedUser ? editedUser.email : ""}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      email: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                className="phonetitle"
                                controlId="formContact"
                              >
                                <Form.Label>Contact#</Form.Label>
                                <Form.Control
                                  type="phone"
                                  placeholder="Enter contact#"
                                  value={editedUser ? editedUser.phone : ""}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      phone: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                className="stalltitle"
                                controlId="formContact"
                              >
                                <Form.Label>Stall</Form.Label>
                                <Form.Control
                                  type="stall"
                                  placeholder="Enter stall"
                                  value={editedUser ? editedUser.stall : ""}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      stall: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                              <Button
                                className="btneditsavechanges"
                                variant="primary"
                                onClick={handleSaveChanges}
                              >
                                Save Changes
                              </Button>
                            </Form>
                          </Modal.Body>
                        </Modal>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          ) : (
            <div className="text-center mt-3"></div>
          )}
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;