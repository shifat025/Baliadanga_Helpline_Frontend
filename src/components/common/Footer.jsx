const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-4 mt-10">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Baliadanga Helpline. All rights reserved.</p>
          <p className="text-sm">A social initiative to connect blood donors with those in need.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  