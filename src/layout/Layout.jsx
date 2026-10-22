import { Outlet } from 'react-router'

const Layout = () => {
    return (
        <div className="w-full max-w-1000px mx-auto px-6 pd-10">
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
