import { Memo } from "../components/memo";
import MainLayout from "../components/MainLayout";
import { MemoSubmit } from "../components/MemoSubmit";

export function MemoPage({ action }) {

    return (
        <>
            <MainLayout>
                <Memo action={action} />
            </MainLayout>
        </>
    )
}

export function MemoSubmitPage() {

    return (
        <>
            <MainLayout>
                <MemoSubmit />
            </MainLayout>

        </>
    )
}