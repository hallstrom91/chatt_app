import { Link } from "react-router-dom";

export default function NotFound() {
  <>
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl lg:text-4xl font-semibold">
          404 - Sidan kunde inte hittas.
        </h1>
        <p className="text-base">
          Beklagar men sidan du försöker hämta existerar inte.
        </p>
        <Link to="/register" className="px-2 py-1 border">
          Tillbaka Hem
        </Link>
      </div>
      ;
    </div>
  </>;
}
