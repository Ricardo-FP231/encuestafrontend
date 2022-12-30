import copy from "copy-to-clipboard";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table, Toast, ToastContainer, ToastHeader } from "react-bootstrap";
import { List, Share, Trash } from "react-bootstrap-icons";
import { confirmAlert } from "react-confirm-alert";
import ReactPaginate from "react-paginate";
import { Link, useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import Switch from "../components/UI/Switch";
import { deletePoll, getUserPolls, togglePollOpened } from "../services/PollService";
import { BASE_URL } from "../utils/constants";

const User = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [polls, setPolls] = useState<any>([]);
  const history=useHistory();

  useEffect(() => {
    fetchPolls();
    ReactTooltip.rebuild();
  }, [currentPage])


  const fetchPolls = async () => {
    const res: any = await getUserPolls(currentPage);
    setPolls(res.data.polls);
    setTotalPages(res.data.totalPages);
    setTotalRecords(res.data.totalRecord);
    ReactTooltip.rebuild();
  }

  const handleTogglePoll = async (id: number) => {
    const _polls = [...polls];
    const poll = _polls.find(poll => poll.id == id);
    poll.opened = !poll.opened;
    setPolls(_polls);
    await togglePollOpened(poll.pollId)
  }

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  }

  const handleDeletePoll = (pollId: string) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h2>Eliminar Encuesta</h2>
            <p>¿Quieres eliminar esta encuesta?</p>
            <Button variant="outline-primary" size="sm" className="me-2"
              onClick={async () => {
                await deletePoll(pollId);
                currentPage === 0 ? fetchPolls() : setCurrentPage(0);
                onClose();
              }}
            >
              Si, Eliminar!
            </Button>
            <Button variant="outline-primary" size="sm" onClick={onClose}>No</Button>
          </div>
        );
      }
    })

  }

  const renderTable = () => {
    return <Table className="mt-4 polls-table" striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Recibir mas respuestas</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {
          polls.map((poll: any) => {
            return (
              <tr key={poll.id}>
                <td>{poll.content}</td>
                <td>
                  <Switch label={!!poll.opened ? "Activo" : "Cerrado"}
                    checked={!!poll.opened}
                    id={poll.pollId}
                    onChange={() => { handleTogglePoll(poll.id) }}
                  ></Switch>
                </td>
                <td className="polls-table-controls">
                  <span data-tip="Compartir encuesta" className="me-2"
                    onClick={() => {
                      copy(`${BASE_URL}/replypoll/${poll.pollId}`);
                      setShowToast(true);
                    }}><Share></Share></span>
                  <span data-tip="Ver Resultados"
                  onClick={()=>history.push(`/results/${poll.pollId}`)}
                  className="me-2"><List></List></span>
                  <span data-tip="Eliminar encuesta" className="me-2"
                    onClick={() => handleDeletePoll(poll.pollId)}
                  ><Trash></Trash></span>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col sm="10" md="10" lg="8" className="mx-auto">
          <h5>Mis Encuestas</h5>
          {
            
            totalRecords > 0 ?
              <>
                {renderTable()}
                < ReactPaginate
                  pageCount={totalPages}
                  forcePage={currentPage}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  previousLabel="Anterior"
                  nextLabel="Siguiente"
                  containerClassName="pagination justify-content-end"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  activeClassName="active"
                  breakLabel="..."
                  onPageChange={handlePageChange}
                ></ReactPaginate>

                <ReactTooltip place="top" effect="solid" />

                <ToastContainer position="top-end">
                  <Toast show={showToast} delay={5000} autohide onClose={() => setShowToast(false)}>
                    <ToastHeader closeButton={false}>Compartido!</ToastHeader>
                    <Toast.Body>Enlace copiado al portapapeles (ctrl+v)</Toast.Body>
                  </Toast>
                </ToastContainer>
              </>
              : <span className="d-block mt-5">Aún no hay encuestas registradas <Link to="/createpoll"> comienza a crear</Link></span>
          }
        </Col>
      </Row>
    </Container >
  )
}

export default User;
