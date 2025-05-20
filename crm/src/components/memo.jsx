import { useEffect, useState } from "react"
import { api } from "../services/api";
import { LightTable } from "./Table";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Forms } from "./Forms";
import { useFetchUsers } from "./Users";
import { MemoSubmit } from "./MemoSubmit";


export function GetDrafts() {

    const [drafts, setDrafts] = useState([]);
    const [resp, setResp] = useState('');

    async function getDrafts() {
        try {
            const res = await api.get('api/Memo/userDrafts')
            setDrafts(res.data.data)
            console.log("data from the get memo api is : ", res.data)
            console.log("type of res.data.data is ", Array.isArray(res.data.data))
        } catch (error) {
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while adding memo');
        }
    }

    useEffect(() => {
        getDrafts();
    }, []);

    return { drafts, getDrafts, resp }
}

export function Memo({ action }) {

    const { drafts, getDrafts, resp: draftResp } = GetDrafts();

    console.log("type of drafts and drafts is", typeof (drafts), drafts)

    const [title, setTitle] = useState('');
    const [Content, setContent] = useState('');
    const [resp, setResp] = useState('');
    const location = useLocation();
    let MemoId = location.state?.id;
    const navigate = useNavigate();

    async function handleCreate(event) {
        setResp('');
        event.preventDefault();
        try {
            const res = await api.post(`/api/Memo`, {
                title: title,
                Content: Content,
            })
            console.log("data returned from the api for memo: ", res.data)
            await getDrafts();
            setTitle('');
            setContent('');
            navigate('/memo')
        } catch (error) {
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while adding memo');
        }
        
    }
    async function handleSubmit() {
        console.log("we are insdie handlesubmit the memoid is", MemoId)
        if (MemoId===null || MemoId===undefined){
            try {
                const res = await api.post(`/api/Memo`, {
                    title: title,
                    Content: Content,
                })
                console.log("data returned from the api for memo: ", res.data)
                MemoId = res.data.data.id;
                console.log("memoID: ", res.data.data.id)
                
            }
                catch (error) {
                    console.log("error message ", error)
                    setResp(error.response?.data?.message || 'Something went wrong while adding memo');
                }
        }
        navigate(`/memo/submit?MemoId=${MemoId}`);
    }

    useEffect(() => {
        setResp('')
        if (Array.isArray(drafts) && drafts.length === 0) {
            console.log("zero drafts");
            setResp("No drafts to show");
        }
        if (action === 'update' && MemoId) {
            console.log("action is update and memo id ", MemoId)
            getById(MemoId)
        }
    }, [action])

    // useEffect(() => {
    //     if (Array.isArray(drafts) && drafts.length === 0) {
    //         console.log("zero drafts");
    //         setResp("No drafts to show");
    //     } else {
    //         setResp("");
    //     }
    // }, [drafts]);


    const th = ['s.no', 'Title', 'Content', 'Action']

    // console.log("is the vendor array? ", Array.isArray(vendor));
    const thead = (
        <tr>
            {th.map((t) => (
                <td scope="col" className="border-botton=0">{t}</td>
            ))}
        </tr>
    )
    const tbody = drafts.length === 0 ? (
        <>
            {/* {console.log("inside if no vendors available")} */}
            <tr>
                <td colSpan={th.length + 1}>No drafts availabe</td>
            </tr>
        </>
    ) : (drafts.map((d, index) => (
        <tr key={d.id}>
            <td>{index + 1}</td>
            <td>
                {
                (() => {
                const c = d.title;
                let c2 = c.substring(0,30);
                return c.length > 30 ? c2 + '...' : c2;
               })()}
            </td>
            <td>
               {(() => {
                const c = d.content;
                let c2 = c.substring(0,50);
                return c.length > 50 ? c2 + '...' : c2;
               })()}
            </td>
            <td>
                <div>
                    <Link to='/memo/update' state={{ id: d.id }} className="nav-link">
                        <i className="material-icons">edit</i>
                        <span>edit</span>
                    </Link>
                    <Link to='/memo/delete' state={{ id: d.id }} className="nav-link">
                        <i className="material-icons">delete</i>
                        <span>delete</span>
                    </Link>
                </div>
            </td>
        </tr>
    )))

    async function getById(id) {
        try {
            const res = await api.get(`/api/Memo/${id}`)
            console.log("data returned from the api for memo: ", res.data.data)
            setTitle(res.data.data.title);
            setContent(res.data.data.content);
            console.log("the title and content: ", title, Content);
        } catch (error) {
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while adding memo');
        }
    }

    async function handleDelete(id) {
        setResp('');
        console.log("memo to be deleted:  and type of memoid", MemoId, typeof (MemoId));
        try {
            const res = await api.delete(`/api/Memo/${id}`, {
                // params: {id: Number(vendorEditID)},
                withCredentials: true,
            });
            console.log("memo deleted", res.data.data);
            getDrafts();
            // setRefresh( prev => !prev)
            navigate('/memo')

        } catch (error) {
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while deleting role');
        }

    }

    async function handleUpdate() {
        setResp('');
        try {
            const res = await api.put(`/api/Memo/${MemoId}?&Title=${title}&Content=${Content}`
            );
            console.log("api endpoint for updating memo returns: ", res.data.data)
            getDrafts();
            navigate('/memo')
        } catch (error) {
            const errormessage = (error.response?.data?.message || "something went wrong while updating the memo")
            setResp(errormessage)
            console.log("error response from the api", errormessage)
            navigate('/memo')
        }
    }

    const deleteform = (
        <div>
            {/* <div  className="form-group">
            <p className="text-center">Delete role <strong>{roleToEdit}</strong></p>
            </div> */}
            <button type="submit" onClick={() => {
                // e.preventDefault();
                handleDelete(MemoId)
            }}
                className="btn btn-primary btn-block">Yes</button>
            <br />
            <Link to='/memo'>
                <button className="btn btn-primary btn-block">No</button>
            </Link>
        </div>
    )

    // const MemoArea = (({draftButton}) => (
    // <>
    //  <div class="col-12 mb-4">
    //                 <div class="card card-small h-100 w-100">
    //                     <div class="card-header border-bottom">
    //                         <h6 class="m-0">New Draft</h6>
    //                     </div>
    //                     <div class="card-body d-flex flex-column h-100">
    //                         <form class="quick-post-form flex-grow-1 d-flex flex-column">
    //                             <div class="form-group">
    //                                 <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /> </div>
    //                             <div class="form-group ">
    //                                 <textarea class="form-control" placeholder="Your content goes here..." onChange={(e) => setContent(e.target.value)} value={Content}></textarea>
    //                             </div>
    //                             <div class="form-group mb-0 d-flex justify-content-between">
    //                                 <button type="button" class="btn btn-accent" onClick={draftButton}>Create Draft</button>
    //                                 <button type="submit" class="btn btn-accent" >Submit</button>
    //                             </div>
    //                         </form>
    //                     </div>
    //                 </div>
    //             </div>
    // </>
    // ))

    if (action === 'add') {
        return (
            <>
                {/* <MemoArea draftButton={handleCreate}/> */}
                <div class="col-12 mb-4">
                    <div class="card card-small h-100 w-100">
                        <div class="card-header border-bottom">
                            <h6 class="m-0">New Draft</h6>
                        </div>
                        <div class="card-body d-flex flex-column h-100">
                            <form class="quick-post-form flex-grow-1 d-flex flex-column">
                                <div class="form-group">
                                    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /> </div>
                                <div class="form-group ">
                                    <textarea class="form-control" placeholder="Your content goes here..." onChange={(e) => setContent(e.target.value)} value={Content}></textarea>
                                </div>
                                <div class="form-group mb-0 d-flex justify-content-between">
                                    <button type="button" class="btn btn-accent" onClick={handleCreate}>Create Draft</button>
                                    <button type="button" class="btn btn-accent" onClick={handleSubmit}>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else if (action === "update") {
        return (
            <>
                {/* <MemoArea draftButton={handleUpdate}/> */}
                <div class="col-12 mb-4">
                    <div class="card card-small h-100 w-100">
                        <div class="card-header border-bottom">
                            <h6 class="m-0">New Draft</h6>
                        </div>
                        <div class="card-body d-flex flex-column h-100">
                            <form class="quick-post-form flex-grow-1 d-flex flex-column">
                                <div class="form-group">
                                    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /> </div>
                                <div class="form-group ">
                                    <textarea class="form-control" placeholder="Your content goes here..." onChange={(e) => setContent(e.target.value)} value={Content}></textarea>
                                </div>
                                <div class="form-group mb-0 d-flex justify-content-between">
                                    <button type="button" class="btn btn-accent" onClick={handleUpdate}>Create Draft</button>
                                    <button type="button" class="btn btn-accent" onClick={handleSubmit}>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else if (action === 'delete') {
        // setResp('')
        return (
            <>
                <p>inside handle delete</p>
                <Forms Formname={`Are you sure you want to delete this memo ?`} form={deleteform} response={resp} />
            </>
        )
    }
    else {
        return (
            <>

                <div>
                    <LightTable tablename={"Memo"} thead={thead} tbody={tbody} link={'/memo/add'} />
                </div>
                {/* <div class="col-lg-3 col-md-12 col-sm-12 mb-4">
                <div class="card card-small">
                    <div class="card-header border-bottom">
                        <h6 class="m-0">Top Referrals</h6>
                    </div>
                    <div class="card-body p-0">
                        <ul class="list-group list-group-small list-group-flush">
                            {drafts.map((d) => (
                                <li className="list-group-item d-flex px-3">

                                    <div className="" >
                                        <a className="" href="#" onClick={() =>getById(d.id)}>
                                            <span class="text-semibold text-fiord-blue">Title: 
                                            {d.title}
                                            </span> <br />
                                            <span class="ml-auto text-right text-semibold text-reagent-gray">Content: 
                                            {d.content}
                                            </span>
                                        </a>
                                    </div>
                                </li>
                            ))} 
                        </ul>
                    </div>
                </div >
            </div > */}
                {/* <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div class="card card-small h-100">
                    <div class="card-header border-bottom">
                        <h6 class="m-0">New Draft</h6>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <form class="quick-post-form">
                            <div class="form-group">
                                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /> </div>
                            <div class="form-group">
                                <textarea class="form-control" placeholder="Your content goes here..." onChange={(e) => setContent(e.target.value)}  value={Content}></textarea>
                            </div>
                            <div class="form-group mb-0">
                                <button type="submit" class="btn btn-accent" onClick={handleCreate}>Create Draft</button>
                            </div>
                            <div class="form-group mb-0">
                                <button type="submit" class="btn btn-accent" >submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> */}
            </>
        )
    }
}