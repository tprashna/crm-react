import { useState } from "react"

export function ButtonPrevNext(){
    const [page, setPage] = useState(1);
    return(
        <>
        <button type="submit" class="btn btn-seccondary" onClick={(e)=> setPage(page-1)}>prev</button>
          <button type="submit" class="btn btn-success" onClick={(e)=> setPage(page+1)}>next</button>
        </>
    )
}