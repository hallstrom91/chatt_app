import SignIn from "@authentication/SignIn";

export default function Login() {
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
