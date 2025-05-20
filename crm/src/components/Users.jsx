import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { LightTable } from "./Table";
import RegistrationForm from "./RegisterForm";


export function useFetchUsers({role, pageNumber, pageSize}) {
  const [users, setUsers] = useState([]);
  const [response, setResponse] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const queryObj = { Role: role, PageNumber: pageNumber, PageSize: pageSize };

  const params = new URLSearchParams(
    Object.entries(queryObj).filter(([_, v]) => v != null)
  );

  const url = `api/Account/users${params.toString() ? '?' + params.toString() : ''}`;
  console.log(url, "is the url")

  async function fetchUsers() {
    try {
      // const res = await api.get(`api/Account/users?PageNumber=${pageNumber}&PageSize=${pageSize}`);
      const res = await api.get(url)
      setUsers(res.data.data.items);
      setTotalCount(res.data.data.totalCount);
      console.log("result from get all users: ", res.data);
      console.log(".data part of get all users result: ", res.data.data);
      console.log("total count as returned from the api : ", res.data.totalCount)
    } catch (error) {
      setResponse(error.response?.data?.message || 'Something went wrong');
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [role, pageNumber, pageSize]);

  return { users, response, fetchUsers, totalCount };
}

export function Users() {

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { users, response, fetchUsers, totalCount } = useFetchUsers({pageNumber:pageNumber, pageSize:pageSize});
  // const [ newrole, setNewRole] = useState('');
  const [resp, setResp] = useState('');
  const totalPages = Math.ceil(totalCount / pageSize);
  console.log("page no, page size, total number of pages, total count : ", pageNumber, pageSize, totalPages, totalCount);
  console.log("type: page no, page size, total number of pages: ", typeof (pageNumber), typeof (pageSize), typeof (totalPages));

  const thead = (
    <tr>
      <td scope="col" class="border-bottom-0">s.no</td>
      <td scope="col" class="border-bottom-0">Full Name</td>
      <td scope="col" class="border-bottom-0">Phone Number</td>
      <td scope="col" class="border-bottom-0">Email</td>
      <td scope="col" class="border-bottom-0">Role</td>
      <td scope="col" class="border-bottom-0">Department</td>
    </tr>
  )

  const tbody = users.map((u, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{u.fullName}</td>
      <td>{u.contact}</td>
      <td>{u.email}</td>
      <td>{u.role}</td>
      <td>{u.department}</td>
    </tr>
  ))

  return (
    <div>

      {/* <RegistrationForm fetchUsers={fetchUsers}/> */}

      <LightTable tablename={"Users"} thead={thead} tbody={tbody} link={'/addUser'} />

      {response && <p>{response}</p>}

      <div className="pagination-controls">
        <button disabled={pageNumber === 1} onClick={() => setPageNumber(pageNumber - 1)}>Prev</button>
        {totalPages > 4 && (
          <>
            <button disabled={pageNumber === 2} onClick={() => setPageNumber(pageNumber - 1)}>{pageNumber + 1}</button>
            <span>...</span>
            <button disabled={pageNumber === totalPages - 1} onClick={() => setPageNumber(totalPages - 1)}>{totalPages - 1}</button>
          </>)}
        <button disabled={pageNumber === totalPages} onClick={() => setPageNumber(pageNumber + 1)}>Next</button>
        <span> Page {pageNumber} of {totalPages} </span>
      </div>

    </div>
  )
}