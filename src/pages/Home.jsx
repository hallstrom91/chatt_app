import SignIn from "@login/SignIn";
import Register from "@login/Register";

export default function Home() {
  return (
    <>
      <main className="w-full h-screen flex flex-col justify-center items-center">
        <div className="m-16 min-w-xl">
          <SignIn />
        </div>
      </main>
    </>
  );
}
