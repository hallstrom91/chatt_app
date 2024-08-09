import SignUp from "@authentication/SignUp";

export default function Register() {
  return (
    <>
      <main className="w-full h-screen flex flex-col justify-center items-center">
        <div className="m-16 min-w-xl">
          <SignUp />
        </div>
      </main>
    </>
  );
}
