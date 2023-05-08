import { Link } from 'react-router-dom';

const BookCard = ({ id, coverImage, title, brief, publishedDate, published, authorName }) => {

    return (
        <Link to={`/home/books/${id}`} >
            <div
                className="bg-slate-200 w-72 p-2 relative h-fit rounded-lg shadow-lg overflow-hidden hover:scale-95 transition duration-200 ease-in-out"
            >
                <img
                    src={coverImage} alt={title}
                    className="h-48 w-[90%] m-auto object-cover object-center aspect-square rounded-lg"
                />

                <div className="p-6">
                    <h3 className="text-2xl font-semibold w-full truncate text-amber-800 h-fit mb-2">{title}</h3>
                    <p className="text-amber-950  truncate mb-2">{brief}</p>
                    <h1 className="text-amber-950 truncate italic flex gap-2 mb-2">
                        <span> {authorName} ,</span>
                        {published ?
                            <span className="text-green-500 font-semibold">
                                {new Date(
                                    publishedDate.seconds * 1000 +
                                    publishedDate.nanoseconds / 1000000
                                ).getFullYear()}

                            </span>
                            :
                            <p className="text-red-500 font-semibold">Draft</p>
                        }
                    </h1>
                </div>
            </div>
        </Link>
    )
}

export default BookCard