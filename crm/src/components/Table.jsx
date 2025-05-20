import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";

export function LightTable({tablename, thead, tbody, link}){

    const [currentPage, setCurrentPage] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState('');


    return(
        <div class="row">
              <div class="col">
                <div class="card card-small mb-4">
                  <div class="card-header border-bottom d-flex justify-content-between">
                    <h6 class=" m-0">{tablename}</h6>
                    {/* <label>rows per page</label>
                    <select >
                      <option value="">10</option>
                      <option value="">20</option>
                      <option value="">30</option>
                    </select> */}
                    <Link to={link}>
                        <button className="btn btn-primary" >Add</button>
                    </Link>
                  </div>
                  <div class="card-body p-0 pb-3 text-center">
                    <table class="table mb-0">
                      <thead class="bg-light">
                        {thead}
                      </thead>
                      <tbody>
                        {tbody}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
    )
}