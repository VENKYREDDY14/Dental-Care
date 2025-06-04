import { Link } from 'react-router-dom';
import Header from '../Header/Header';

const Home = () => (
  <>
    <Header />
    <div className="flex flex-col items-center h-screen justify-center w-[90%] max-w-[1110px] mx-auto pt-2 pb-12 md:flex-row md:justify-between md:pt-24">
      <div className="flex flex-col items-center md:items-start mt-[70px] md:mt-0">
        <h1 className="text-[#1e293b] font-bold text-[30px] leading-[1.2] text-center md:text-[46px] md:text-left">
          Welcome to Dental Care
        </h1>
        <p className="font-roboto text-[14px] leading-7 text-[#64748b] mt-9 mb-0 text-center md:text-[18px] md:mt-0 md:text-left">
          At Dental Care, we connect you with the best dentists to ensure your oral health is in top shape. Explore our list of professional dentists and book an appointment today!
        </p>
        <Link to="/dentists">
          <button
            type="button"
            className="text-white text-[14px] md:text-[16px] font-normal font-roboto bg-[#0967d2] py-3 px-6 rounded-lg mt-5 cursor-pointer focus:outline-none w-auto md:w-[150px]"
          >
            Find Dentists
          </button>
        </Link>
      </div>
      <img
        src="https://res.cloudinary.com/dsad92ak9/image/upload/qcvoeggyz73bq66ti9pc" 
        alt="Dentist illustration"
        className="hidden md:block w-1/2 max-w-[450px] ml-[85px]"
      />
    </div>
  </>
);

export default Home;