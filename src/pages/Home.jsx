import Navbar from '../components/Navbar/Navbar'

const Home = () => {
    return (
        <div className="w-full max-w-1000px mx-auto px-6 pb-10">
            <Navbar />
            <main>
                <h1 className="text-3xl text-orange-500 fond-bold text-center">
                    Home Page
                </h1>
            </main>
        </div>
    )
}

export default Home
